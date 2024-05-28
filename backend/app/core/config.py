import os
from dotenv import load_dotenv
import boto3

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# S3 setup
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("S3_REGION_NAME")
)
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
