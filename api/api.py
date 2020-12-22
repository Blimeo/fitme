# Import the libraries
import os
import pymongo
from flask import Flask, jsonify, request, Response
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())
app = Flask(__name__)
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
jwt = JWTManager(app)

mongo_uri = os.getenv("MONGO_URI")
client = pymongo.MongoClient(mongo_uri)
db = client.get_database('fitme_db')
users_collection = db['users']


@app.route("/register", methods=["POST"])
def register():
    email = request.form["email"]

    if users_collection.find_one({"email": email}):
        return jsonify(message="User already exists"), 409
    else:
        first_name = request.form["first_name"]
        last_name = request.form["last_name"]
        password = request.form["password"]
        user_info = dict(first_name=first_name,
                         last_name=last_name, email=email, password=password)
        users_collection.insert_one(user_info)
        return jsonify(message="User added successfully"), 201


@app.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.form["email"]
        password = request.form["password"]

    if users_collection.find_one({"email": email, "password": password}):
        access_token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401


@app.route("/create", methods=["POST"])
@jwt_required
def create():
    return jsonify(message="yay"), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
