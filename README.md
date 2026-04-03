# Cellular React + Flask App

This project is a Dockerized React and Flask starter organized around feature cells.

## Architecture

- `frontend/`: Vite + React client.
- `backend/`: Flask API using an app factory.
- `docker/nginx/`: edge gateway that routes web traffic.

Each feature cell owns its UI, API client, backend routes, and backend service logic. The initial `hello`, `status`, and `recipes` cells are included as working examples.

## Run

```bash
docker compose up --build
```

Then open `http://localhost:8080`.

To enable Spoonacular recipe search, add the key to the repo-root `.env` file:

```bash
cp .env.example .env
# then set SPOONACULAR_API_KEY in .env
```

Then start the app:

```bash
docker compose up --build
```

The backend reads `SPOONACULAR_API_KEY` from the environment on startup. In Docker, that comes from the repo-root `.env` via `docker-compose.yml`.

The landing page renders live data from:

- `GET /api/hello`
- `GET /api/status`
- `GET /api/recipes/search?q=pasta`
- `GET /api/recipes/saved`
- `POST /api/recipes/saved`

## Cellular Pattern

To add a new feature:

1. Create `frontend/src/cells/<cell-name>/`.
2. Create `backend/cells/<cell-name>/`.
3. Register the backend blueprint in `backend/app/__init__.py`.
4. Render the new cell from `frontend/src/app/App.jsx` or route it from a page shell.

## Recipes Cell

The `recipes` cell currently does two things:

- Proxies Spoonacular recipe search through Flask so the API key stays on the backend.
- Saves selected recipes in an in-memory Flask store as a starter persistence layer.

Saved recipes are not durable yet. Restarting the backend clears them.
