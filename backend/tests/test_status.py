from app import create_app


def test_status_cell_returns_snapshot():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/status")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["cell"] == "status"
    assert payload["state"] == "healthy"

