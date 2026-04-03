from flask import Blueprint

from .service import build_status_snapshot


status_bp = Blueprint("status", __name__)


@status_bp.get("")
def get_status():
    return build_status_snapshot()

