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
from datetime import datetime

load_dotenv(find_dotenv())
app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
jwt = JWTManager(app)
port = int(os.environ.get("PORT", 5000))

mongo_uri = os.getenv("MONGO_URI")
connection_timeout = 2000  # ms
client = pymongo.MongoClient(
    mongo_uri, serverSelectionTimeoutMS=connection_timeout)
db = client.get_database('fitme_db')
users_collection = db['users']
items_collection = db['items']
fits_collection = db['fits']
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
        access_token = create_access_token(identity=email, expires_delta=False)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401

# Converts following/followers IDs to usernames.
@app.route("/my_profile_data", methods=["GET"])
@jwt_required
def my_profile_data():
    user_data = users_collection.find_one(
        {"email": get_jwt_identity()})
    if (user_data is None):
        return jsonify(message="User not found"), 404
    del user_data["password"]
    del user_data["email"]
    if user_data["following"] is not None:
        user_data["following"] = list(map(lambda id_: users_collection.find_one({"_id": id_})["username"], user_data["following"]))
    if user_data["followers"] is not None:
        user_data["followers"] = list(map(lambda id_: users_collection.find_one({"_id": id_})["username"], user_data["followers"]))
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
        body["avatar"] = item_img[0]
    del body["is_updating_avatar"]
    # Bulk update user's items and fits if they change their username
    if body["username"] is not user_data["username"]:
        # Bulk update items
        bulk = db["items"].initialize_unordered_bulk_op()
        counter = 0
        for id in user_data["uploaded_items"]:
            bulk.find({ "_id": id }).update({ "$set": { "uploader": body["username"] } })
            counter += 1
            # 500 limit bypass
            if (counter % 500 == 0):
                bulk.execute()
                bulk = db["users"].initialize_ordered_bulk_op()
        if (counter % 500 != 0):
            bulk.execute()
        # Bulk update fits
        bulk = db["fits"].initialize_unordered_bulk_op()
        counter = 0
        for id in user_data["uploaded_fits"]:
            bulk.find({ "_id": id }).update({ "$set": { "uploader": body["username"] } })
            counter += 1
            # 500 limit bypass
            if (counter % 500 == 0):
                bulk.execute()
                bulk = db["fits"].initialize_ordered_bulk_op()
        if (counter % 500 != 0):
            bulk.execute()
    users_collection.update_one({"email": identity}, {"$set": body})
    return jsonify(message="Successfully updated"), 200

@app.route("/get_user_items", methods=["GET"])
def get_user_items():
    username = request.args.get("username")
    user_data = users_collection.find_one(
        {"username": username})
    if user_data["uploaded_items"] is None:
        return jsonify(items=[])
    item_object_ids = user_data["uploaded_items"]
    docs = items_collection.find({"_id": {"$in": item_object_ids}})
    if docs is None:
        return jsonify(items=[])
    page = int(request.args.get("page"))
    page_size = 4
    skips = page_size * (page - 1)
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]
    
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs)

@app.route("/get_user_fits", methods=["GET"])
def get_user_fits():
    username = request.args.get("username")
    user_data = users_collection.find_one(
        {"username": username})
    if user_data["uploaded_fits"] is None:
        return jsonify(fits=[])
    fit_ids = [ObjectId(x) for x in user_data["uploaded_fits"]]
    docs = fits_collection.find({"_id": {"$in": fit_ids}})
    if docs is None:
        return jsonify(fits=[])
    page = int(request.args.get("page"))
    page_size = 4
    skips = page_size * (page - 1)  
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]
    for fit in docs:
        fit['_id'] = str(fit['_id'])
        for item in fit['items']:
            if item != "":
                item['_id'] = str(item['_id'])
    return jsonify(fits=docs)

@app.route("/get_user_fav_items", methods=["GET"])
def get_user_fav_items():
    username = request.args.get("username")
    user_data = users_collection.find_one(
        {"username": username})
    if user_data["favorite_items"] is None:
        return jsonify(items=[])
    item_object_ids = [ObjectId(x) for x in user_data["favorite_items"]]
    docs = items_collection.find({"_id": {"$in": item_object_ids}})
    if docs is None:
        return jsonify(items=[])
    page = int(request.args.get("page"))
    page_size = 4
    skips = page_size * (page - 1)
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]
    
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs)

@app.route("/get_user_fav_fits", methods=["GET"])
def get_user_fav_fits():
    username = request.args.get("username")
    user_data = users_collection.find_one(
        {"username": username})
    if user_data["favorite_fits"] is None:
        return jsonify(fits=[])
    fit_object_ids = [ObjectId(x) for x in user_data["favorite_fits"]]
    docs = fits_collection.find({"_id": {"$in": fit_object_ids}})
    if docs is None:
        return jsonify(fits=[])
    page = int(request.args.get("page"))
    page_size = 4
    skips = page_size * (page - 1)
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]
    
    for fit in docs:
        fit['_id'] = str(fit['_id'])
        for item in fit['items']:
            if item != "":
                item['_id'] = str(item['_id'])
    return jsonify(fits=docs)

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
    user_to_follow = user_to_follow_data["_id"]
    if user_data is None or user_to_follow_data is None:
        return jsonify(message="User not found"), 404
    if user_to_follow in user_data["following"]:
        user_data["following"].remove(user_to_follow_data["_id"])
        user_to_follow_data["followers"].remove(user_data["_id"])
    else:
        user_data["following"].append(user_to_follow_data["_id"])
        user_to_follow_data["followers"].append(user_data["_id"])

    users_collection.update_one({"_id": user_data["_id"]},
                                {"$set": {"following": user_data["following"]}})
    users_collection.update_one({"_id": user_to_follow},
                                {"$set": {"followers": user_to_follow_data["followers"]}})
    return jsonify(message="Follow/unfollow successful"), 200


@app.route("/submit_item", methods=["POST"])
@jwt_required
def submit_item():
    identity = get_jwt_identity()
    data = dict(request.form)
    data = json.loads(data["postData"])
    if (not data["name"].strip()) or (not data["brand"].strip()) or len(data["images"]) == 0:
        return jsonify(error="Bad item data")
    item_in_db = items_collection.find_one(
        {"name": data["name"]})
    if data["name"].startswith("Create new item (item not in list)") or item_in_db is not None:
        return jsonify(error="Bad item title")
    data["price"] = float(data["price"])
    images = request.files.to_dict()
    content = []
    for f in list(images.values()):
        content.append(f.stream)
    manager = ImageManager()
    item_imgs = manager.uploadImage(
        content, [d["path"] for d in data["images"]])
    del data["images"]
    data["imgs"] = item_imgs
    data["uploader"] = users_collection.find_one(
        {"email": identity})['username']
    data["favorited"] = 0
    data["inFits"] = []
    data["uploadDate"] = datetime.today().strftime('%Y-%m-%d')
    _id = items_collection.insert_one(data)
    _id = _id.inserted_id
    users_collection.update({"email": identity}, {"$push": {"uploaded_items": _id }})
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


@app.route("/get_item", methods=["POST"])
def get_item():
    req = request.get_json(force=True)
    item_id = req.get('item_id', None)
    item = get_item_objs([item_id])
    if not item:
        return jsonify(error="true")
    return jsonify(error="false", item=item[item_id])

@app.route("/get_fit/<fit_id>", methods=["GET"])
def get_fit(fit_id):
    if not bson.objectid.ObjectId.is_valid(fit_id):
        return jsonify(error="true")
    fit = fits_collection.find_one({'_id': ObjectId(fit_id)})
    if not fit:
        return jsonify(error="true")
    fit['_id'] = str(fit['_id'])
    for item in fit['items']:
        if item != "":
            item['_id'] = str(item['_id'])
    return jsonify(error="false", fit=fit)

def is_gender(text):
    return text == "Men" or text == "Women" or text == "Unisex"

@app.route("/get_fits", methods=["POST"])
def get_fits():
    fit_ids = request.get_json(force=True)
    fits = []
    for fit_id in fit_ids:
        if not bson.objectid.ObjectId.is_valid(fit_id):
            return jsonify(error="true")
        fit = fits_collection.find_one({'_id': ObjectId(fit_id)})
        if not fit:
            return jsonify(error="true")
        fit['_id'] = str(fit['_id'])
        for item in fit['items']:
            item['_id'] = str(item['_id'])
        fits.append(fit)
    return jsonify(error="false", fits=fits)

@app.route("/upload_fit", methods=["POST"])
@jwt_required
def upload_fit():
    identity = get_jwt_identity()
    data = dict(request.form)
    fit = json.loads(data["data"])
    annotations = json.loads(data["annotations"])
    if (fit["name"] == "" or fit["img_url"] == "" or not is_gender(fit["gender"])):
        return jsonify(error="Bad fit metadata")
    del fit['itemBoxes'], fit['width'], fit['height']
    item_names = [item['data']['text'] for item in annotations]
    items = []
    for name in item_names:
        item_doc = items_collection.find_one({"name" : name})
        if (name == "Label this fit item!"):
            return jsonify(error="Unannotated item")
        if item_doc is None:
            items.append("")
        else:
            items.append(item_doc)
    annotations = list(
        map(
            lambda anno: anno["data"]["text"][len("Create new item (item not in list): "):]
            if anno["data"]["text"].startswith(
                "Create new item (item not in list): "
            )
            else anno,
            annotations,
        )
    )
    fit["items"] = items
    fit["annotations"] = annotations
    fit["uploader"] = users_collection.find_one(
        {"email": identity})['username']
    fit["favorited"] = 0
    fit["uploadDate"] = datetime.today().strftime('%Y-%m-%d')
    fit_id = fits_collection.insert_one(fit)
    fit_id = str(fit_id.inserted_id)
    users_collection.update({"email": identity}, {"$push": {"uploaded_fits": fit_id }}) 
    for item in items:
        if item != "":
            item_id = item['_id']
            items_collection.update_one({"_id": item_id}, {"$addToSet": {"inFits": fit_id}})
    return jsonify(ok=True)

@app.route("/favorite_item/<item_id>", methods=["PUT"])
@jwt_required
def favorite_item(item_id):
    identity = get_jwt_identity()
    users_collection.update({"email": identity}, {"$push": {"favorite_items": item_id }})
    items_collection.update({"_id": ObjectId(item_id)}, {"$inc": {"favorited": 1 }})
    return jsonify(ok=True)

@app.route("/item_favorite_status/<item_id>", methods=["GET"])
@jwt_required
def item_favorite_status(item_id):
    identity = get_jwt_identity()
    favorite_items = users_collection.find_one(
        {"email": identity})['favorite_items']
    found = item_id in favorite_items
    return jsonify(found=found)

@app.route("/unfavorite_item/<item_id>", methods=["PUT"])
@jwt_required
def unfavorite_item(item_id):
    identity = get_jwt_identity()
    username = users_collection.find_one(
        {"email": identity})['username']
    users_collection.update({"email": identity}, {"$pull": {"favorite_items": item_id }})
    items_collection.update({"_id": ObjectId(item_id)}, {"$inc": {"favorited": -1 }})
    return jsonify(ok=True)

@app.route("/fit_favorite_status/<fit_id>", methods=["GET"])
@jwt_required
def fit_favorite_status(fit_id):
    identity = get_jwt_identity()
    favorite_fits = users_collection.find_one(
        {"email": identity})['favorite_fits']
    found = fit_id in favorite_fits
    return jsonify(found=found)

@app.route("/favorite_fit/<fit_id>", methods=["PUT"])
@jwt_required
def favorite_fit(fit_id):
    identity = get_jwt_identity()
    username = users_collection.find_one(
        {"email": identity})['username']
    users_collection.update({"email": identity}, {"$push": {"favorite_fits": fit_id }})
    fits_collection.update({"_id": ObjectId(fit_id)}, {"$inc": {"favorited": 1 }})
    return jsonify(ok=True)

@app.route("/unfavorite_fit/<fit_id>", methods=["PUT"])
@jwt_required
def unfavorite_fit(fit_id):
    identity = get_jwt_identity()
    username = users_collection.find_one(
        {"email": identity})['username']
    users_collection.update({"email": identity}, {"$pull": {"favorite_fits": fit_id }})
    fits_collection.update({"_id": ObjectId(fit_id)}, {"$inc": {"favorited": -1 }})
    return jsonify(ok=True)

def comma_separated_params_to_list(param):
    result = []
    for val in param.split(','):
        if val:
            result.append(val)
    return result

def get_gender_from_request(request):
    request_data = {}
    params = request.args.getlist("gender") or request.form.getlist("gender")
    if len(params) == 1 and ',' in params[0]:
        request_data["gender"] = comma_separated_params_to_list(params[0])
    else:
        request_data["gender"] = params
    return request_data["gender"]

@app.route("/discover_items", methods=["GET"])
def discover_items():
    gender_condition = []
    # Gender filtering
    for filter in get_gender_from_request(request):
        gender_condition.append({"gender": filter })
    conditions = [{"$or" : gender_condition}]
    #Category filtering
    category = request.args.get("category")
    if category != "any":
        conditions.append({"category" : category})
    docs = items_collection.find({"$and": conditions})
    num_docs = docs.count()
    page = int(request.args.get("page"))
    page_size = 12
    skips = page_size * (page - 1)
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]
    
    
    for item in docs:
        item['_id'] = str(item['_id'])
        item['num_docs'] = num_docs
    return jsonify(items=docs)

@app.route("/discover_fits", methods=["GET"])
def discover_fits():
    condition = []
    for filter in get_gender_from_request(request):
        condition.append({"gender": filter })
    docs = fits_collection.find({"$or": condition})
    num_docs = docs.count()
    page = int(request.args.get("page"))
    page_size = 12
    skips = page_size * (page - 1)
    cursor = docs.skip(skips).limit(page_size)
    docs = [x for x in cursor]

    for fit in docs:
        fit['_id'] = str(fit['_id'])
        fit['num_docs'] = num_docs
        for item in fit['items']:
            if item != "":
                item['_id'] = str(item['_id'])
    return jsonify(fits=docs)

@app.route("/recommended_items", methods=["GET"])
@jwt_optional
def recommended_items():
    identity = get_jwt_identity()
    if identity:
        # TODO: custom recommendations
        pass
    gender_condition = []
    # Gender filtering
    for filter in get_gender_from_request(request):
        gender_condition.append({"gender": filter })
    conditions = [{"$or" : gender_condition}]
    #Category filtering
    category = request.args.get("category")
    if category != "any":
        conditions.append({"category" : category})
    docs = list(items_collection.find({"$and": conditions}))
    random.shuffle(docs)
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs[:3])

@app.route("/recommended_fits", methods=["GET"])
@jwt_optional
def recommended_fits():
    identity = get_jwt_identity()
    if identity:
        # TODO: custom recommendations
        pass
    condition = []
    for filter in get_gender_from_request(request):
        condition.append({"gender": filter})
    docs = list(fits_collection.find({"$or": condition}))
    random.shuffle(docs)
    for fit in docs:
        fit['_id'] = str(fit['_id'])
        for item in fit['items']:
            if item != "":
                item['_id'] = str(item['_id'])
    return jsonify(fits=docs[:4])


@app.route("/item_names", methods=["GET"])
def item_names():
    docs = list(items_collection.find({}))
    item_names = [item['name'] for item in docs]
    return jsonify(items=item_names)


@app.route("/item_search/<query>", methods=["GET"])
def item_search(query):
    docs = list(items_collection.find({'name':
                                    {'$regex': query, '$options': 'i'}}, projection=['name']))
    for item in docs:
        item['_id'] = str(item['_id'])
    return jsonify(items=docs)


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
        return jsonify(img_url=url,
                       boxes=boxes,
                       scores=scores,
                       width=crop_params["width"],
                       height=crop_params["height"])
    else:
        return jsonify(error="Bad image upload")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=port)
