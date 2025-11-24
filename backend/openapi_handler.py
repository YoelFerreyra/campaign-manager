import os
import json
import yaml

def lambda_handler(event, context):
    file_path = os.path.join(os.path.dirname(__file__), "openapi.yaml")
    with open(file_path, "r", encoding="utf-8") as f:
        yaml_content = yaml.safe_load(f)
        spec_json = json.dumps(yaml_content)

    html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <title>Swagger UI</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          const spec = {spec_json};
          SwaggerUIBundle({{
            spec: spec,
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis]
          }})
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
