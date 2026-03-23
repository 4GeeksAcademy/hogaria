"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Service, City, Company, ServiceCategory, UserProfile, Booking, PaymentMethod, Notification, BookingStatus, PaymentMethodType, Opinion
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, and_, or_
from google.oauth2 import id_token
from google.auth.transport import requests
import stripe
import os
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Configurar Stripe con la clave secreta
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }


@api.route("/search" , methods=["GET"])
def search():
    q = request.args.get("q", "")
    service_id = request.args.get("service_id")
    city_id = request.args.get("city_id")

    # Query base: usuarios que tengan al menos un servicio
    query = db.session.query(Service).join(Company).join(City)
    filters = []
    # Filtro de texto (nombre, apellido, email)
    if q:
        search = f"%{q}%"
        filters.append(
            or_(
            (Company.name.ilike(search)) |
            (Company.email.ilike(search)) |
            (Service.name.ilike(search))
            )
        )

    # Filtro por servicio
    if service_id:
        filters.append(Service.category == ServiceCategory(service_id))

    # Filtro por ciudad (en el servicio)
    if city_id:
        filters.append(Service.city_id == city_id)

    # Evitar duplicados
    if filters:
        query = query.filter(and_(*filters))

    services = query.all()

    results = []
    for service in services:
        service_data = service.serialize()
        service_data["company_name"] = service.company.name if service.company else "Sin nombre"
        service_data["company_email"] = service.company.email if service.company else "Sin email"
        service_data["company_phone"] = service.company.phone if service.company else "Sin teléfono"
        service_data["company_rate"] = service.company.rate if service.company else 0
        
        results.append(service_data)

    return jsonify(results), 200


# Endpoint mock para servicios

@api.route("/services", methods=["GET"])
def get_services():
    db_services = db.session.query(Service).all()
    services = [service.serialize() for service in db_services]
    return jsonify(services), 200

@api.route("/cities", methods=["GET"])
def get_cities():
    db_cities = City.query.all()
    if not db_cities:
        return jsonify({"msg": "No hay ciudades disponibles"}), 404
    cities = [city.serialize() for city in db_cities]
    return jsonify(cities), 200


@api.route("/cities", methods=["POST"])
def create_city():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"msg": "Name is required"}), 400

    city = City(name=name)
    db.session.add(city)
    db.session.commit()

    return jsonify(city.serialize()), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son requeridos"}), 400
    
    user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()

    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "user_type": "user"
            }
        }), 200

    company = db.session.execute(select(Company).where(
        Company.email == email)).scalar_one_or_none()

    if company and company.check_password(password):
        access_token = create_access_token(identity=str(company.id))
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": company.id,
                "email": company.email,
                "user_type": "company"
            }
        }), 200
    return jsonify({"error": "Credenciales inválidas"}), 401


@api.route("/google-login", methods=["POST"])
def google_login():

    token = request.json.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "3815072650-c4055m3c1jvbe74af5jqve8clov2ib9t.apps.googleusercontent.com"
        )

        email = idinfo["email"]
        name = idinfo.get("name")

        # buscar usuario en la base de datos
        user = User.query.filter_by(email=email).first()

        if not user:
            user = User(
                email=email
            )
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "access_token": access_token,
            "user": {
                "email": email,
                "name": name
            }
        }), 200

    except ValueError:
        return jsonify({"msg": "Invalid Google token"}), 401


@api.route("/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id", type=int)

    if not user_id:
        return jsonify({"msg": "user_id es requerido"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200



@api.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    print(user_id)
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

# Endpoints de Empresa


@api.route('/company', methods=['GET'])
@jwt_required()
def get_company():
    "Obtener perfil de empresa"""
    company_id = get_jwt_identity()
    print(company_id)
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    company_data = company.serialize()
    company_data["services"] = [service.serialize()
                                for service in company.services]
    company_data["opinions"] = [opinion.serialize()
                                for opinion in company.opinions]

    return jsonify(company_data), 200


@api.route('/register/company', methods=['POST'])
def create_company():
    """Crear una nueva empresa"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    required_fields = ['name', 'email', 'password', 'phone']
    missing = [field for field in required_fields if field not in data]

    if missing:
        return jsonify({"error": "Faltan datos, por favor complete todos los campos. Datos a rellenar: {missing}"}), 400

    existing_company = db.session.execute(select(Company).where(
        Company.email == email)).scalar_one_or_none()
    existing_user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    if existing_company or existing_user:
        return jsonify({"error": "Este correo electrónico ya está registrado en otra cuenta"}), 400

    company = Company(
        email=data.get('email'),
        name=data.get('name'),
        phone=data.get('phone'),
        rate=0.0
    )
    company.set_password(password)

    db.session.add(company)
    db.session.commit()

    return jsonify(company.serialize()), 201


@api.route('/company/<int:company_id>', methods=['PUT'])
def update_company(company_id):
    """Actualizar información de empresa"""
    data = request.json
    company = Company.query.get(company_id)

    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    company.name = data.get('name', company.name)
    company.phone = data.get('phone', company.phone)
    company.email = data.get('email', company.email)

    db.session.commit()
    return jsonify(company.serialize()), 200

# Endpoints de Servicios


@api.route('/company/services', methods=['GET'])
@jwt_required()
def get_company_services():
    company_id = get_jwt_identity() # Extrae el ID del Token
    services = Service.query.filter_by(company_id=company_id).all()
    return jsonify([service.serialize() for service in services]), 200

# 2. POST: Crear servicio (Corregida con Seguridad y Enums)
@api.route('/company/services', methods=['POST']) # Quitamos el ID de la URL por seguridad
@jwt_required()
def create_service():
    company_id = get_jwt_identity() 
    data = request.json

    # Validación de campos
    required_fields = ["name", "category", "direction", "price", "city_id"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Campo '{field}' requerido"}), 400

    try:
        try:
            category_enum = ServiceCategory(data['category'].lower())
        except ValueError:
            return jsonify({"error": "Categoría no válida"}), 400

        new_service = Service(
            company_id=company_id,
            name=data.get('name'),
            category=category_enum, # Pasamos el objeto Enum, no el string
            direction=data.get('direction'),
            price=float(data.get('price')),
            city_id=int(data.get('city_id')),
            all_day=data.get('all_day', False)
        )

        db.session.add(new_service)
        db.session.commit()

        return jsonify(new_service.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/service/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    data = request.json
    service = db.session.get(Service, service_id)

    if not service:
        return jsonify({"error": "Servicio no encontrado"}), 404

    try:
            
        service.category = ServiceCategory(data['category'])
        service.name = data.get('name', service.name)
        service.price = float(data.get('price', service.price))
        service.direction = data.get('direction', service.direction)
        service.all_day = bool(data.get('all_day', service.all_day))
        
        if 'city_id' in data and data['city_id']:
            service.city_id = int(data['city_id'])

        db.session.commit()
        return jsonify({"success": True, "message": "Actualizado"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@api.route('/service/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    service = db.session.get(Service, service_id)

    if not service:
        return jsonify({"error": "Servicio no encontrado"}), 404

    try:
        db.session.delete(service)
        db.session.commit()
        return jsonify({"success": True, "message": "Actualizado"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api.route('/company/<int:company_id>/opinions', methods=['GET'])
def get_company_opinions(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    opinions = Opinion.query.filter_by(company_id=company_id).all()
    results = []
    for opinion in opinions:
        opinion_data = opinion.serialize()
        opinion_data["author_name"] = opinion.author.name if opinion.author else "Sin nombre"
        opinion_data["author_lastname"] = opinion.author.lastname if opinion.author else "Sin apellido"
        results.append(opinion_data)

    return jsonify(results), 200


@api.route('/company/<int:company_id>/opinions', methods=['POST'])
def create_opinion(company_id):
    """Crear una nueva opinión"""
    data = request.json

    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    required_fields = ['user_id', 'rating']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Campo '{field}' requerido"}), 400

    opinion = Opinion(
        user_id=data.get('user_id'),
        company_id=company_id,
        rating=data.get('rating'),
        comment=data.get('comment')
    )

    db.session.add(opinion)

    # Actualizar el rating promedio de la empresa
    company.rate = db.session.query(db.func.avg(Opinion.rating)).filter_by(
        company_id=company_id).scalar() or 0.0

    db.session.commit()

    return jsonify(opinion.serialize()), 201


@api.route('/company/<int:company_id>/gallery', methods=['GET'])
def get_company_gallery(company_id):
    """Obtener galería de una empresa"""
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    return jsonify([]), 200


@api.route('/company/<int:company_id>/coverage', methods=['GET'])
def get_company_coverage(company_id):
    """Obtener zonas de cobertura de una empresa"""
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Empresa no encontrada"}), 404

    return jsonify([]), 200


# STRIPE ENDPOINTS

@api.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Crear un PaymentIntent para el formulario de pago integrado"""
    try:
        data = request.get_json()

        # Validar datos requeridos
        amount = data.get('amount')
        product_name = data.get('product_name', 'Servicio')
        user_id = data.get('user_id')

        if not amount:
            return jsonify({'error': 'El monto es requerido'}), 400

        # Convertir a centavos
        amount_cents = int(float(amount))

        # Crear PaymentIntent en lugar de Checkout Session
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='usd',
            description=product_name,
            metadata={
                'product_name': product_name,
                'user_id': user_id if user_id else 'guest'
            }
        )

        return jsonify({
            'clientSecret': payment_intent.client_secret,
            'paymentIntentId': payment_intent.id
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@api.route('/payment-success', methods=['POST'])
def payment_success():
    """Confirmar que el pago fue exitoso y guardar en BD"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        user_id = data.get('user_id')

        if not session_id:
            return jsonify({'error': 'session_id es requerido'}), 400

        # Recuperar detalles de la sesión desde Stripe
        session = stripe.checkout.Session.retrieve(session_id)

        if session.payment_status != 'paid':
            return jsonify({'error': 'El pago no fue completado'}), 400

        # Aquí puedes guardar la transacción en tu BD
        # Por ejemplo, actualizar el estado del Booking o crear un registro de pago

        return jsonify({
            'success': True,
            'message': 'Pago procesado correctamente',
            'amount': session.amount_total / 100  # Convertir de centavos a dólares
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@api.route('/save-payment', methods=['POST'])
def save_payment():
    "Guardar transacción de pago en la BD"
    try:
        from api.models import PaymentMethod

        data = request.get_json()

        payment_intent_id = data.get('paymentIntentId')
        amount = data.get('amount')
        product_name = data.get('productName', 'Servicio')
        user_id = data.get('userId')
        customer_email = data.get('customerEmail')
        status = data.get('status', 'succeeded')

        if not payment_intent_id or not amount:
            return jsonify({'error': 'Parámetros requeridos: paymentIntentId, amount'}), 400

        # Convertir centavos a dólares
        amount_dollars = amount / 100

        # Crear registro de pago
        payment = PaymentMethod(
            user_id=user_id,
            type='CREDIT_CARD',  # Ajusta según el tipo de pago
            holder_name=customer_email or 'Cliente',
            stripe_payment_intent_id=payment_intent_id,
            amount=amount_dollars,
            currency='USD',
            description=product_name,
            customer_email=customer_email,
            status=status,
            is_default=False
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Pago guardado correctamente',
            'payment_id': payment.id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@api.route('register/user', methods=['POST'])
def registerUser():

    data = request.get_json()
    email = data.get("email").lower().strip()
    password = data.get("password")
    name = data.get("name")
    lastname = data.get("lastname")
    phone = data.get("phone")

    requested_fields = {"email", "password", "name", "lastname", "phone"}

    missing = [field for field in requested_fields if field not in data]

    if missing:
        return jsonify({"error": "Faltan datos, por favor complete todos los campos. Datos a rellenar: {missing}"}), 400

    existing_user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    existing_company = db.session.execute(select(Company).where(
        Company.email == email)).scalar_one_or_none()

    if existing_user or existing_company:
        return jsonify({"error": "Este correo electrónico ya está registrado en otra cuenta"}), 400

    new_user = User(
        email=email,
        name=name,
        lastname=lastname,
        phone=phone
    )

    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Su usuario ha sido creado exitosamente"}), 201


@api.route('register/company', methods=['POST'])
def registerCompany():

    data = request.get_json()
    email = data.get("email").lower().strip()
    password = data.get("password")
    name = data.get("name")
    phone = data.get("phone")

    requested_fields = {"email", "password", "name", "phone"}

    missing = [field for field in requested_fields if field not in data]

    if missing:
        return jsonify({"error": "Faltan datos, por favor complete todos los campos. Datos a rellenar: {missing}"}), 400

    existing_company = db.session.execute(select(Company).where(
        Company.email == email)).scalar_one_or_none()

    if existing_company:
        return jsonify({"error": "Ya existe una empresa con este correo electrónico"}), 400

    new_company = Company(
        email=email,
        name=name,
        password=password,
        phone=phone
    )

    new_company.set_password(password)

    db.session.add(new_company)
    db.session.commit()
    return jsonify({"message": "Su ecuenta de empresa ha sido creada exitosamente"}), 201

@api.route("/service-categories", methods=["GET"])
def get_service_categories():
    categories = [{"value": c.value, "label": c.value.capitalize()} for c in ServiceCategory]
    return jsonify(categories), 200

@api.route('/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify([c.serialize() for c in companies]), 200

@api.route('/reviews', methods=['POST'])
def create_review():
    data = request.json
    
    # Extraer con valores por defecto para evitar NoneType errors
    rating = data.get("rating")
    comment = data.get("comment", "")
    company_id = data.get("company_id")
    user_id = data.get("user_id")

    try:
        new_review = Opinion(
            user_id=int(user_id), # Forzamos entero
            company_id=int(company_id),
            rating=int(rating),
            comment=comment
        )

        db.session.add(new_review)
        
        # Actualización del rate de la empresa
        company = Company.query.get(company_id)
        if company:
            # Buscamos todas las opiniones de esta empresa
            reviews = Opinion.query.filter_by(company_id=company_id).all()
            # Calculamos la media incluyendo la nueva
            total_sum = sum([r.rating for r in reviews]) + int(rating)
            new_media = (total_sum / (len(reviews) + 1))
            company.rate = round(new_media, 1)

        db.session.commit()
        return jsonify({"msg": "Valoración guardada"}), 201

    except Exception as e:
        db.session.rollback()
        # Imprime esto en tu terminal para ver el fallo real
        print(f"DEBUG ERROR: {str(e)}") 
        return jsonify({"msg": "Error interno", "error": str(e)}), 500

@api.route('/company-profile', methods=['GET'])
def get_company_profile():
    company_id = request.args.get("company_id")
    
    if not company_id:
        return jsonify({"msg": "Falta el ID de la empresa"}), 400
        
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Empresa no encontrada"}), 404
    
    company_data = company.serialize()
    categories = list(set(service.category.value for service in company.services))
    company_data["categories"] = categories
    
    return jsonify(company_data), 200
