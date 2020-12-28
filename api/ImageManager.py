import boto3
from botocore.exceptions import ClientError
import uuid

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
                response = self.client.upload_fileobj(
                    f, self.bucket, new_filename)
                new_url = S3_BASE_URL + new_filename 
                ids.append(new_url)
            except ClientError as e:
                return False
        print(ids)
        return ids

    def __init__(self):
        aws_creds = open(".aws_creds", "r").read()
        self.aws_access_key_id = aws_creds.split(" ")[0]
        self.aws_secret_access_key = aws_creds.split(" ")[1]
        self.region = "us-east-1"
        self.bucket = "fitme"
        self.client = boto3.client('s3', region_name=self.region,
                                   aws_access_key_id=self.aws_access_key_id,
                                   aws_secret_access_key=self.aws_secret_access_key)
