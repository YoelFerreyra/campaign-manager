import os
import yaml
import json

def lambda_handler():
    file_path = os.path.join(os.path.dirname(__file__), "openapi.yaml")
    with open(file_path, "r", encoding="utf-8") as f:
        spec = yaml.safe_load(f)

    spec_json = json.dumps(spec)

    html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </head>
      <body>
        <div id="redoc-container"></div>
        <script>
          const spec = {spec_json};
          Redoc.init(spec, {{ scrollYOffset: 50 }}, document.getElementById('redoc-container'));
        </script>
      </body>
    </html>
    """

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*"
        },
        "body": html
    }
