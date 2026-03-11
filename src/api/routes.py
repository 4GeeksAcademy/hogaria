"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select
from api.models import Service, City

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }


@api.route("/api/search")
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


@api.route("/api/services")
def get_services():
    # Datos de ejemplo, reemplaza por consulta real a la BD cuando esté lista
    services = [
        {"id": 1, "nombre": "Plomería", "categoria": "Oficios", "ciudad_id": 1},
        {"id": 2, "nombre": "Electricidad", "categoria": "Oficios", "ciudad_id": 2},
        {"id": 3, "nombre": "Carpintería", "categoria": "Oficios", "ciudad_id": 1}
    ]
    return jsonify(services), 200

# Endpoint mock para ciudades


@api.route("/api/cities")
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
