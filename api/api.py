# Import the libraries
import os
import pymongo
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from dotenv import load_dotenv, find_dotenv
from flask_bcrypt import Bcrypt

load_dotenv(find_dotenv())
app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
jwt = JWTManager(app)

mongo_uri = os.getenv("MONGO_URI")
connection_timeout = 2000  # ms
client = pymongo.MongoClient(
    mongo_uri, serverSelectionTimeoutMS=connection_timeout)
db = client.get_database('fitme_db')
users_collection = db['users']


@app.route("/register", methods=["POST"])
def register():
    req = request.get_json(force=True)
    email = req.get('email', None)
    username = req.get('username', None)

    if len(username) < 4 or len(username) > 16:
        return jsonify(message="bad username"), 409
    if users_collection.find_one({"email": email}):
        return jsonify(message="A user with that email already exists."), 409
    elif users_collection.find_one({'username': username}):
        return jsonify(message="A user with that username already exists."), 409
    else:
        password = req.get('password', None)
        if len(password) < 8 or len(password) > 128:
            return jsonify(message="bad password"), 409
        hashed = bcrypt.generate_password_hash(password)
        user_info = dict(email=email,
                         username=username, password=hashed)
        users_collection.insert_one(user_info)
        return jsonify(message="User added successfully"), 201


@app.route("/login", methods=["POST"])
def login():
    req = request.get_json(force=True)
    email = req.get('email', None)
    password = req.get('password', None)

    account_data = users_collection.find_one({"email": email})
    if (account_data is not None) and bcrypt.check_password_hash(account_data["password"], password):
        access_token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401


@app.route("/profile_data", methods=["POST"])
@jwt_required
def profile_data():
    # req = request.get_json(force=True)
    print(get_jwt_identity())
    return jsonify(identity=get_jwt_identity()), 200


@app.route("/submit_item", methods=["POST"])
@jwt_required
def submit_item():
    print("hi", flush=True)
    identity = get_jwt_identity()
    print(request, identity)
    data = dict(request.form)
    images = request.files
    print(data)
    print(images)
    return jsonify(message="yay"), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
