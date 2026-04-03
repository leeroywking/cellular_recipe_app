import json
import os
from typing import Any
from urllib import error, parse, request


SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes/complexSearch"
DEFAULT_RESULT_COUNT = 4
_saved_recipes: list[dict[str, Any]] = []


class RecipeSearchError(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        *,
        upstream_status: int | None = None,
        upstream_body: str = "",
        request_url: str = "",
    ):
        super().__init__(message)
        self.status_code = status_code
        self.upstream_status = upstream_status
        self.upstream_body = upstream_body
        self.request_url = request_url


def _build_search_url(query: str) -> tuple[str, str]:
    api_key = os.environ.get("SPOONACULAR_API_KEY", "").strip()
    if not api_key:
        raise RecipeSearchError(
            "SPOONACULAR_API_KEY is not configured on the backend.",
            status_code=500,
        )

    params = parse.urlencode(
        {
            "query": query,
            "number": DEFAULT_RESULT_COUNT,
            "apiKey": api_key,
        }
    )
    safe_params = parse.urlencode(
        {
            "query": query,
            "number": DEFAULT_RESULT_COUNT,
            "apiKey": "***redacted***",
        }
    )
    return (
        f"{SPOONACULAR_BASE_URL}?{params}",
        f"{SPOONACULAR_BASE_URL}?{safe_params}",
    )


def _build_recipe_information_url(recipe_id: int) -> tuple[str, str]:
    api_key = os.environ.get("SPOONACULAR_API_KEY", "").strip()
    if not api_key:
        raise RecipeSearchError(
            "SPOONACULAR_API_KEY is not configured on the backend.",
            status_code=500,
        )

    base_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    params = parse.urlencode({"apiKey": api_key})
    safe_params = parse.urlencode({"apiKey": "***redacted***"})
    return (
        f"{base_url}?{params}",
        f"{base_url}?{safe_params}",
    )


def _open_json(url: str) -> dict[str, Any]:
    req = request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        },
    )
    with request.urlopen(req, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def search_recipes(query: str) -> dict[str, Any]:
    url, safe_url = _build_search_url(query)

    try:
        payload = _open_json(url)
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        raise RecipeSearchError(
            f"Spoonacular request failed with status {exc.code}.",
            status_code=502,
            upstream_status=exc.code,
            upstream_body=details.strip(),
            request_url=safe_url,
        ) from exc
    except error.URLError as exc:
        raise RecipeSearchError(
            "Could not reach Spoonacular from the backend.",
            status_code=502,
            request_url=safe_url,
        ) from exc

    return {
        "cell": "recipes",
        "query": query,
        "results": [_enrich_recipe(recipe) for recipe in payload.get("results", [])],
        "totalResults": payload.get("totalResults", 0),
    }


def _enrich_recipe(recipe: dict[str, Any]) -> dict[str, Any]:
    recipe_id = recipe.get("id")
    if not recipe_id:
        return _normalize_recipe(recipe)

    url, safe_url = _build_recipe_information_url(recipe_id)

    try:
        details = _open_json(url)
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        raise RecipeSearchError(
            f"Spoonacular recipe details request failed with status {exc.code}.",
            status_code=502,
            upstream_status=exc.code,
            upstream_body=body.strip(),
            request_url=safe_url,
        ) from exc
    except error.URLError as exc:
        raise RecipeSearchError(
            "Could not reach Spoonacular recipe details from the backend.",
            status_code=502,
            request_url=safe_url,
        ) from exc

    return _normalize_recipe(details)


def list_saved_recipes() -> list[dict[str, Any]]:
    return list(_saved_recipes)


def save_recipe(recipe: dict[str, Any]) -> dict[str, Any]:
    normalized = _normalize_saved_recipe(recipe)

    existing = next((item for item in _saved_recipes if item["id"] == normalized["id"]), None)
    if existing:
        return existing

    _saved_recipes.append(normalized)
    return normalized


def _normalize_recipe(recipe: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": recipe.get("id"),
        "title": recipe.get("title", "Untitled recipe"),
        "image": recipe.get("image"),
        "sourceUrl": recipe.get("sourceUrl"),
        "readyInMinutes": recipe.get("readyInMinutes"),
        "servings": recipe.get("servings"),
        "summary": _strip_html(recipe.get("summary", "")),
        "ingredients": [
            ingredient.get("original")
            for ingredient in recipe.get("extendedIngredients", [])
            if ingredient.get("original")
        ],
    }


def _normalize_saved_recipe(recipe: dict[str, Any]) -> dict[str, Any]:
    recipe_id = recipe.get("id")
    title = str(recipe.get("title", "")).strip()

    if not recipe_id:
        raise ValueError("A recipe id is required.")
    if not title:
        raise ValueError("A recipe title is required.")

    return {
        "id": recipe_id,
        "title": title,
        "image": recipe.get("image"),
        "sourceUrl": recipe.get("sourceUrl"),
        "readyInMinutes": recipe.get("readyInMinutes"),
        "servings": recipe.get("servings"),
        "summary": str(recipe.get("summary", "")).strip(),
        "ingredients": [
            str(ingredient).strip()
            for ingredient in recipe.get("ingredients", [])
            if str(ingredient).strip()
        ],
    }


def _strip_html(value: str) -> str:
    text = str(value)
    replacements = {
        "<b>": "",
        "</b>": "",
        "<i>": "",
        "</i>": "",
        "<p>": "",
        "</p>": "",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return " ".join(text.split())
