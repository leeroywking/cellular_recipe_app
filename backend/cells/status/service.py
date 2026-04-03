from datetime import UTC, datetime


def build_status_snapshot() -> dict:
    return {
        "cell": "status",
        "service": "backend",
        "state": "healthy",
        "timestamp": datetime.now(UTC).isoformat(),
        "message": "The status cell is responding from Flask.",
    }

