import os
import boto3
from urllib.parse import urlparse
from utils.response import cors_response

s3 = boto3.client("s3")
BUCKET = os.environ.get("ASSETS_BUCKET")

def lambda_handler(event, context):
    try:
        import json
        body = json.loads(event.get("body", "{}"))
        file_url = body.get("file_url")
        if not file_url:
            return cors_response(400, {"error": "file_url is required"})

        parsed = urlparse(file_url)
        key = parsed.path.lstrip("/")

        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET, "Key": key},
            ExpiresIn=300
        )

        return cors_response(200, {"url": presigned_url})

    except Exception as e:
        return cors_response(500, {"error": str(e)})
