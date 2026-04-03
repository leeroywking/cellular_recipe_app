from flask import Blueprint, request

from .service import (
    RecipeSearchError,
    list_saved_recipes,
    save_recipe,
    search_recipes,
)


recipes_bp = Blueprint("recipes", __name__)


@recipes_bp.get("/search")
def get_recipe_search_results():
    query = request.args.get("q", "").strip()

    if not query:
        return {
            "cell": "recipes",
            "query": query,
            "results": [],
            "message": "Provide a search query to look up recipes.",
        }

    try:
        payload = search_recipes(query)
    except RecipeSearchError as exc:
        response = {
            "cell": "recipes",
            "error": str(exc),
        }
        if exc.upstream_status is not None:
            response["upstreamStatus"] = exc.upstream_status
        if exc.upstream_body:
            response["upstreamBody"] = exc.upstream_body
        if exc.request_url:
            response["requestUrl"] = exc.request_url
        return response, exc.status_code

    return payload


@recipes_bp.get("/saved")
def get_saved_recipes():
    return {
        "cell": "recipes",
        "saved": list_saved_recipes(),
    }


@recipes_bp.post("/saved")
def post_saved_recipe():
    recipe = request.get_json(silent=True) or {}

    try:
        saved_recipe = save_recipe(recipe)
    except ValueError as exc:
        return {
            "cell": "recipes",
            "error": str(exc),
        }, 400

    return {
        "cell": "recipes",
        "savedRecipe": saved_recipe,
        "saved": list_saved_recipes(),
    }, 201
