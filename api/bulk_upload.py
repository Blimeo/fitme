'''
Run this script to upload 40 of each clothing type to the items colleciton.
'''

import os
import json
import pymongo
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
mongo_uri = os.getenv("MONGO_URI")
connection_timeout = 2000
client = pymongo.MongoClient(
    mongo_uri, serverSelectionTimeoutMS=connection_timeout)
db = client.get_database('fitme_db')
users_collection = db['users']
items_collection = db['items']

my_set = set()
equivalence_classes = [['Tops', 'Tshirts', 'Shirts', 'Tops'], ['Pants', 'Trousers'], 
                        ['Sweatshirts and Hoodies', 'Sweatshirts'], ['Coats and Jackets', 'Jackets']]
clothing_types = {'Tshirts', 'Shirts', 'Casual Shoes', 'Watches', 'Sports Shoes', 
                  'Tops', 'Handbags', 'Heels', 'Sunglasses', 'Flip Flops', 'Sandals', 
                  'Belts', 'Backpacks', 'Socks', 'Formal Shoes',  'Jeans', 'Shorts', 
                  'Trousers', 'Flats', 'Dresses', 'Earrings', 'Jackets', 'Sweaters', 
                  'Sweatshirts', 'Leggings', 'Skirts', 'Pants', 'Dresses', 'Flats', 
                  'Leggings'}

color_equivalence_classes = [["Maroon", "Burgundy"], ["Beige", "Taupe", "Nude", "Coffee Brown", "Skin", "Khaki", "Tan"], 
                            ["Pink", "Rose", "Mauve", "Magenta"], ["White", "Off White"],
                            ["Blue", "Turquoise Blue"], ["Green", "Fluorescent Green", "Sea Green"],
                            ["Brown", "Mushroom Brown", "Bronze", "Rust"], ["Multicolored", "NA"], ["Yellow", "Mustard"],
                            ["Grey", "Metallic", "Steel", "Grey Melange"], ["Purple", "Lavender"]]

colors = {"Black", "White", "Blue", "Brown", "Grey", "Red", "Green", "Pink", "Navy Blue", 
          "Purple", "Silver", "Yellow", "Beige", "Gold", "Maroon", "Orange", "Olive", "Cream",
          "Charcoal", "Peach", "Multicolored"}

dict_counts = {}

def get_equivalence_class(clothing_type):
    for lst in equivalence_classes:
        if clothing_type in lst:
            return lst[0]
    return clothing_type

def get_color_equivalence_class(clothing_color):
    for lst in color_equivalence_classes:
        if clothing_color in lst:
            return lst[0]
    return clothing_color

for _file in os.listdir():
    if len(clothing_types) == 0:
        break 
    if _file.endswith(".json"):
        with open(_file) as f:
            d = json.load(f)
            if "data" in d:
                le_data = d["data"]
                if ("articleType" in le_data and le_data["articleType"]["typeName"] in clothing_types 
                and "productDisplayName" in le_data and "price" in le_data 
                and "brandName" in le_data and "gender" in le_data and "baseColour" in le_data 
                and "styleImages" in le_data and "default" in le_data["styleImages"]):
                    if le_data["articleType"]["typeName"] in dict_counts:
                        if (dict_counts[le_data["articleType"]["typeName"]] >= 40):
                            clothing_types.remove(le_data["articleType"]["typeName"])
                            continue
                        dict_counts[le_data["articleType"]["typeName"]] += 1
                    else:
                        dict_counts[le_data["articleType"]["typeName"]] = 1
                    curr_item = {"uploader": "fitme_admin", "uploadDate": "2021-01-24", "favorited": 0, "inFits": []}
                    curr_item["name"] = le_data["productDisplayName"]
                    curr_item["description"] = "Uploaded from our fashion dataset."
                    curr_item["price"] = round(float(le_data["price"]) * 0.014)
                    curr_item["brand"] = le_data["brandName"]
                    curr_item["tags"] = [] if "usage" not in le_data else [le_data["usage"]]
                    curr_item["gender"] = "Unisex" if le_data["gender"] != "Men" and le_data["gender"] != "Women" else le_data["gender"]
                    curr_item["color"] = get_color_equivalence_class(le_data["baseColour"])
                    curr_item["imgs"] = [le_data["styleImages"]["default"]["imageURL"]]
                    curr_item["category"] = get_equivalence_class(le_data["articleType"]["typeName"])
                    _id = items_collection.insert_one(curr_item)
                    users_collection.update({"username": "fitme_admin"}, {"$push": {"uploaded_items": _id.inserted_id }})

print("Script run complete")