from cells.recipes import service
from app import create_app


def test_recipe_search_returns_results(monkeypatch):
    def fake_search(query):
        return {
            "cell": "recipes",
            "query": query,
            "results": [
                {
                    "id": 101,
                    "title": "Lemon Pasta",
                    "image": "https://example.com/lemon-pasta.jpg",
                    "sourceUrl": "https://example.com/lemon-pasta",
                    "readyInMinutes": 20,
                    "servings": 2,
                    "summary": "Bright and quick.",
                    "ingredients": ["200g pasta", "1 lemon", "2 tbsp olive oil"],
                }
            ],
            "totalResults": 1,
        }

    app = create_app()
    client = app.test_client()

    monkeypatch.setattr("cells.recipes.routes.search_recipes", fake_search)

    response = client.get("/api/recipes/search?q=pasta")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["cell"] == "recipes"
    assert payload["query"] == "pasta"
    assert payload["results"][0]["title"] == "Lemon Pasta"
    assert payload["results"][0]["ingredients"][0] == "200g pasta"


def test_recipe_search_requires_query():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/recipes/search")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["results"] == []


def test_recipe_save_and_list():
    service._saved_recipes.clear()

    app = create_app()
    client = app.test_client()
    recipe = {
        "id": 101,
        "title": "Lemon Pasta",
        "image": "https://example.com/lemon-pasta.jpg",
        "sourceUrl": "https://example.com/lemon-pasta",
        "readyInMinutes": 20,
        "servings": 2,
        "summary": "Bright and quick.",
        "ingredients": ["200g pasta", "1 lemon", "2 tbsp olive oil"],
    }

    save_response = client.post("/api/recipes/saved", json=recipe)
    list_response = client.get("/api/recipes/saved")

    assert save_response.status_code == 201
    save_payload = save_response.get_json()
    assert save_payload["savedRecipe"]["title"] == "Lemon Pasta"

    assert list_response.status_code == 200
    list_payload = list_response.get_json()
    assert len(list_payload["saved"]) == 1
    assert list_payload["saved"][0]["id"] == 101
    assert list_payload["saved"][0]["ingredients"][1] == "1 lemon"

    service._saved_recipes.clear()
