"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
    q = request.args.get("q", "")                       #Recoge los filtros de búsqueda
    category = request.args.get("category_id")
    city = request.args.get("city_id")


    query = db.session.query(Professional).join(Service)

    return jsonify(response_body), 200
