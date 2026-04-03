from app import create_app


def test_hello_cell_returns_payload():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/hello")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["cell"] == "hello"
    assert payload["message"] == "Hello world from Flask."
