import json
import os
import boto3
from utils.response import cors_response
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = os.environ.get("ASSETS_BUCKET")

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        filename = body.get("filename")
        content_type = body.get("content_type", "application/octet-stream")

        if not filename:
            return cors_response(400, {"error": "filename is required"})

        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        key = f"uploads/{timestamp}-{filename}"

        presigned_url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": BUCKET,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=300,
        )

        return cors_response(200, {
            "upload_url": presigned_url,
            "file_url": f"https://{BUCKET}.s3.amazonaws.com/{key}"
        })

    except Exception as e:
        return cors_response(500, {"error": str(e)})
