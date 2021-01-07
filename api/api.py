# Import the libraries
import os
import pymongo
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, jwt_optional
from dotenv import load_dotenv, find_dotenv
from flask_bcrypt import Bcrypt
from ImageManager import ImageManager
from bson.objectid import ObjectId
from collections import OrderedDict
import bson
import json
from bson import json_util
import imghdr
import random
from OutfitMLModel import OutfitMLModel
from PIL import Image

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
items_collection = db['items']
model = OutfitMLModel()


@app.route("/register", methods=["POST"])
def register():
    req = request.get_json(force=True)
    email = req.get('email', None)
    username = req.get('username', None)

    if len(username) < 4 or len(username) > 16 or username.count(" ") > 0:
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
                         username=username,
                         password=hashed,
                         avatar="DEFAULT_PROFILE_IMAGE",
                         uploaded_items=[],
                         uploaded_fits=[],
                         favorite_items=[],
                         favorite_fits=[],
                         following=[],
                         followers=[],
                         instagram="NONE_PROVIDED",
                         twitter="NONE_PROVIDED",
                         youtube="NONE_PROVIDED"
                         )
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


@app.route("/my_profile_data", methods=["GET"])
@jwt_required
def my_profile_data():
    user_data = users_collection.find_one(
        {"email": get_jwt_identity()})
    if (user_data is None):
        return jsonify(message="User not found"), 404
    del user_data["password"]
    del user_data["email"]
    return json.dumps(user_data, sort_keys=True, indent=4, default=json_util.default)


@app.route("/update_profile", methods=["PUT"])
@jwt_required
def update_profile():
    body = json.loads(dict(request.form)["postData"])
    identity = get_jwt_identity()
    user_data = users_collection.find_one(
        {"email": identity})
    if user_data is None:
        return jsonify(message="User not found"), 404
    if body["username"] == "OWN PROFILE":
        body["username"] = user_data["username"]
    if body["is_updating_avatar"]:
        manager = ImageManager()
        image = request.files.to_dict()["profileImage"]
        item_img = manager.uploadImage(
            [image], [imghdr.what(image)])
        body["avatar"] = "https://fitme.s3.amazonaws.com/" + item_img[0]
    del body["is_updating_avatar"]

    users_collection.update_one({"email": identity}, {"$set": body})
    return jsonify(message="Successfully updated"), 200


@app.route("/profile_data", methods=["GET"])
def profile_data():
    username = request.args["username"]
    user_data = users_collection.find_one(
        {"username": username})
    if (user_data is None):
        return jsonify(message="User not found"), 404
    del user_data["password"]
    del user_data["email"]
    return json.dumps(user_data, sort_keys=True, indent=4, default=json_util.default)


# Follows/unfollows a user.
@app.route("/follow_user", methods=["PUT"])
@jwt_required
def follow_user():
    user_to_follow = request.args["username"]
    identity = get_jwt_identity()
    user_data = users_collection.find_one(
        {"email": identity})
    user_to_follow_data = users_collection.find_one(
        {"username": user_to_follow})
    if user_data is None or user_to_follow_data is None:
        return jsonify(message="User not found"), 404
    if user_to_follow in user_data["following"]:
        user_data["following"].remove(user_to_follow)
        user_to_follow_data["followers"].remove(user_data["username"])
    else:
        user_data["following"].append(user_to_follow)
        user_to_follow_data["followers"].append(user_data["username"])

    users_collection.update_one({"email": identity},
                                {"$set": {"following": user_data["following"]}})
    users_collection.update_one({"username": user_to_follow},
                                {"$set": {"followers": user_to_follow_data["followers"]}})
    return jsonify(message="Follow/unfollow successful"), 200


@ app.route("/submit_item", methods=["POST"])
@ jwt_required
def submit_item():
    identity = get_jwt_identity()
    data = dict(request.form)
    data = json.loads(data["postData"])
    images = request.files.to_dict()
    content = []
    for f in list(images.values()):
        content.append(f.stream)
    manager = ImageManager()
    item_imgs = manager.uploadImage(
        content, [d["path"] for d in data["images"]])
    del data['images']
    data["imgs"] = item_imgs
    data["uploader"] = users_collection.find_one(
        {"email": identity})['username']
    items_collection.insert_one(data)
    return jsonify(message="Item upload successful!"), 200

# Returns a dict consisting of {item_id : item_obj}


def get_item_objs(ids):
    items = OrderedDict()
    for i in ids:
        if not bson.objectid.ObjectId.is_valid(i):
            return None
    for i in ids:
        item = items_collection.find_one({'_id': ObjectId(i)})
        if not item:
            return None
        item['_id'] = str(item['_id'])
        items[i] = item
    return items


@ app.route("/get_item", methods=["POST"])
def get_item():
    req = request.get_json(force=True)
    item_id = req.get('item_id', None)
    item = get_item_objs([item_id])
    if not item:
        return jsonify(error="true")
    return jsonify(error="false", item=item[item_id])


@app.route("/discover_items", methods=["GET"])
def discover():
    docs = list(items_collection.find({}))
    random.shuffle(docs)
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs)


@app.route("/recommended_items", methods=["GET"])
@jwt_optional
def recommended():
    identity = get_jwt_identity()
    if identity:
        # TODO: custom recommendations
        pass
    docs = list(items_collection.find({}))
    random.shuffle(docs)
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs[:4])


@app.route("/verify_access_token", methods=["GET"])
@jwt_required
def verify_jwt():
    return jsonify(message="Good access token"), 200


@app.route("/submit_fit_image", methods=["POST"])
@jwt_required
def submit_fit_image():
    data = dict(request.form)
    crop_params = json.loads(data["crop"])
    image = request.files["img"]
    if image:
        mngr = ImageManager()
        # url contains the s3 url for the image to be processed
        url = mngr.crop_upload(image.stream, crop_params)
        boxes, scores = model.label_image(url)
        return jsonify(img_url=url, boxes=boxes, scores=scores)
    else:
        return jsonify(error="Bad image upload")


if __name__ == "__main__":
    app.run(port=5000, debug=True)
