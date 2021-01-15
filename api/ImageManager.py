import boto3
from botocore.exceptions import ClientError
import uuid
from PIL import Image
import io


S3_BASE_URL = "https://fitme.s3.amazonaws.com/"


class ImageManager:
    # Uploads images to S3 and returns unique filenames
    def uploadImage(self, files, filenames):
        ids = []

        for i in range(len(files)):
            f = files[i]
            name = filenames[i]
            ext = name.split(".")[-1]
            try:
                new_filename = uuid.uuid4().hex + "." + ext
                print(f, self.bucket, new_filename)
                response = self.client.upload_fileobj(
                    f, self.bucket, new_filename)
                new_url = S3_BASE_URL + new_filename
                ids.append(new_url)
            except ClientError as e:
                print(e)
                return False
        return ids

    # Crops image and uploads it
    def crop_upload(self, image, crop):
        im = Image.open(image)
        left, right = crop['x'], crop['x'] + crop['width']
        top, bottom = crop['y'], crop['y'] + int(crop['height'])
        im = im.crop((left, top, right, bottom))
        file_obj = io.BytesIO()
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
        im.save(file_obj, "JPEG")
        file_obj.seek(0)
        return self.uploadImage([file_obj], ["a.jpeg"])[0]

    def __init__(self):
        aws_creds = open(".aws_creds", "r").read()
        self.aws_access_key_id = aws_creds.split(" ")[0]
        self.aws_secret_access_key = aws_creds.split(" ")[1]
        self.region = "us-east-1"
        self.bucket = "fitme"
        self.client = boto3.client('s3', region_name=self.region,
                                   aws_access_key_id=self.aws_access_key_id,
                                   aws_secret_access_key=self.aws_secret_access_key)
