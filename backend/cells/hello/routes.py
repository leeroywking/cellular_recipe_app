from flask import Blueprint

from .service import build_hello_payload


hello_bp = Blueprint("hello", __name__)


@hello_bp.get("")
def get_hello():
    return build_hello_payload()

