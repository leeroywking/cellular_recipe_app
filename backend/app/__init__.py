from flask import Flask

from cells.hello.routes import hello_bp
from cells.recipes.routes import recipes_bp
from cells.status.routes import status_bp


def create_app() -> Flask:
    app = Flask(__name__)

    @app.after_request
    def apply_default_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    app.register_blueprint(hello_bp, url_prefix="/api/hello")
    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(status_bp, url_prefix="/api/status")

    @app.get("/api/health")
    def healthcheck():
        return {"status": "ok"}

    return app
