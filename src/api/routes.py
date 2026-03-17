"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Service, City, Company, ServiceCategory, UserProfile, Booking, PaymentMethod, Notification, BookingStatus, PaymentMethodType, Opinion
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }


@api.route("/search")
def search():
    q = request.args.get("q", "")
    service_id = request.args.get("service_id")
    city_id = request.args.get("city_id")

    # Query base: usuarios que tengan al menos un servicio
    query = db.session.query(User).join(User.history)

    # Filtro de texto (nombre, apellido, email)
    if q:
        query = query.filter(
            (User.firstname.ilike(f"%{q}%")) |
            (User.lastname.ilike(f"%{q}%")) |
            (User.email.ilike(f"%{q}%"))
        )

    # Filtro por servicio
    if service_id:
        query = query.filter(Service.id == service_id)

    # Filtro por ciudad (en el servicio)
    if city_id:
        query = query.filter(Service.city_id == city_id)

    # Evitar duplicados
    query = query.distinct()

    users = query.all()

    # Serializar usuarios y sus servicios
    results = []
    for user in users:
        user_data = {
            "id": user.id,
            "username": user.email,  # O usa otro campo si tienes username
            "name": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "telefono": user.phone,
            "servicios": [s.serialize() for s in user.history]
        }
        results.append(user_data)

    return jsonify(results), 200


# Endpoint mock para servicios


@api.route("/services")
def get_services():
    # Datos de ejemplo, reemplaza por consulta real a la BD cuando esté lista
    services = [
        {"id": 1, "nombre": "Plomería", "categoria": "Oficios", "ciudad_id": 1},
        {"id": 2, "nombre": "Electricidad", "categoria": "Oficios", "ciudad_id": 2},
        {"id": 3, "nombre": "Carpintería", "categoria": "Oficios", "ciudad_id": 1}
    ]
    return jsonify(services), 200

# Endpoint mock para ciudades


@api.route("/cities", methods=["GET"])
def get_cities():
    # Datos de ejemplo, reemplaza por consulta real a la BD cuando esté lista
    cities = [
        {"id": 1, "nombre": "Madrid"},
        {"id": 2, "nombre": "Barcelona"},
        {"id": 3, "nombre": "Valencia"}
    ]
    return jsonify(cities), 200

# DESDE AQUI EMPECE.


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }), 200


@api.route("/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id", type=int)

    if not user_id:
        return jsonify({"msg": "user_id es requerido"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route('/user/profile', methods=['PUT'])
def update_user_profile():
    "Actualizar perfil del usuario"

    data = request.json
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Actualizar campos
    name = data.get('name')
    if name:
        parts = name.strip().split(" ", 1)
        user.firstname = parts[0]
        if len(parts) > 1:
            user.lastname = parts[1]
    user.phone = data.get('phone', user.phone)
    user.email = data.get('email', user.email)

    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/user/change-password', methods=['POST'])
def change_password():

    data = request.json
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

     # Validar contraseña actual con hash

    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"error": "Contraseña actual y nueva requeridas"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada correctamente"}), 200


@api.route('/user/bookings', methods=['GET'])
def get_user_bookings():
    "Obtener todas las reservas del usuario"

    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([booking.serialize() for booking in bookings]), 200


@api.route('/user/bookings', methods=['POST'])
def create_booking():
    "Crear una nueva reserva"
    data = request.json
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    # Validar datos requeridos
    required_fields = ['service_name', 'date', 'price']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Campo '{field}' requerido"}), 400

    booking = Booking(
        user_id=user_id,
        service_name=data.get('service_name'),
        description=data.get('description'),
        date=data.get('date'),
        price=data.get('price'),
        status=BookingStatus.PENDING
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify(booking.serialize()), 201


@api.route('/user/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    "Obtener detalles de una reserva específica"

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Reserva no encontrada"}), 404

    return jsonify(booking.serialize()), 200


@api.route('/user/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    "Actualizar una reserva"

    data = request.json
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error": "Reserva no encontrada"}), 404

    booking.service_name = data.get('service_name', booking.service_name)
    booking.description = data.get('description', booking.description)
    booking.date = data.get('date', booking.date)
    booking.price = data.get('price', booking.price)
    booking.status = BookingStatus(data.get('status', booking.status.value))

    db.session.commit()
    return jsonify(booking.serialize()), 200


@api.route('/user/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Cancelar/Eliminar una reserva"""
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Reserva no encontrada"}), 404

    # Cambiar estado a CANCELLED en lugar de eliminar
    booking.status = BookingStatus.CANCELLED
    db.session.commit()

    return jsonify({"message": "Reserva cancelada"}), 200


@api.route('/user/payment-methods', methods=['GET'])
def get_payment_methods():
    """Obtener métodos de pago del usuario"""
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    methods = PaymentMethod.query.filter_by(user_id=user_id).all()
    return jsonify([method.serialize() for method in methods]), 200


@api.route('/user/payment-methods', methods=['POST'])
def create_payment_method():
    """Crear un nuevo método de pago"""
    data = request.json
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    # Validar datos
    required_fields = ['type', 'holder_name']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Campo '{field}' requerido"}), 400

    payment_method = PaymentMethod(
        user_id=user_id,
        type=PaymentMethodType(data.get('type')),
        last_four=data.get('last_four'),
        holder_name=data.get('holder_name'),
        is_default=data.get('is_default', False)
    )

    db.session.add(payment_method)
    db.session.commit()

    return jsonify(payment_method.serialize()), 201


@api.route('/user/payment-methods/<int:method_id>', methods=['PUT'])
def update_payment_method(method_id):
    """Actualizar un método de pago"""
    data = request.json
    method = PaymentMethod.query.get(method_id)

    if not method:
        return jsonify({"error": "Método de pago no encontrado"}), 404

    method.holder_name = data.get('holder_name', method.holder_name)
    method.is_default = data.get('is_default', method.is_default)

    db.session.commit()
    return jsonify(method.serialize()), 200


@api.route('/user/payment-methods/<int:method_id>', methods=['DELETE'])
def delete_payment_method(method_id):
    """Eliminar un método de pago"""
    method = PaymentMethod.query.get(method_id)
    if not method:
        return jsonify({"error": "Método de pago no encontrado"}), 404

    db.session.delete(method)
    db.session.commit()

    return jsonify({"message": "Método de pago eliminado"}), 200


# ENDPOINTS DE NOTIFICACIONES

@api.route('/user/notifications', methods=['GET'])
def get_notifications():
    """Obtener notificaciones del usuario"""
    user_id = request.args.get('user_id', type=int)
    is_read = request.args.get('is_read', type=bool)

    if not user_id:
        return jsonify({"error": "user_id requerido"}), 400

    query = Notification.query.filter_by(user_id=user_id)

    if is_read is not None:
        query = query.filter_by(is_read=is_read)

    notifications = query.order_by(Notification.id.desc()).all()
    return jsonify([notif.serialize() for notif in notifications]), 200


@api.route('/user/notifications/<int:notification_id>', methods=['PUT'])
def mark_notification_read(notification_id):
    "Marcar notificación como leída"
    notification = Notification.query.get(notification_id)
    if not notification:
        return jsonify({"error": "Notificación no encontrada"}), 404

    notification.is_read = True
    db.session.commit()

    return jsonify(notification.serialize()), 200


@api.route('register/user', methods=['POST'])
def register():
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    lastname = data.get("lastname")
    phone = data.get("phone")

    requested_fields = {"email", "password", "name", "lastname", "phone"}

    missing = [field for field in requested_fields if field not in data]
    
    if missing:
        return jsonify({"error":"Faltan datos, por favor complete todos los campos. Datos a rellenar: {missing}"}), 400

    existing_user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if existing_user:
        return jsonify({"error":"Ya existe un usuario con este correo electrónico"}), 400
    
    new_user = User(
        email=email,
        firstname=name,
        lastname=lastname,
        phone=phone
    )

    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"Su usuario ha sido creado exitosamente"}), 201
