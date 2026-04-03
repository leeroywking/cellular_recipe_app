# Codex Working Notes

This repository is a Dockerized React + Flask app organized around feature cells. It now includes a working Spoonacular-backed recipe search flow, an in-memory saved recipes flow, and a softer earthy farmhouse visual theme on the frontend.

## Current Stack

- Frontend: Vite + React 18 in `frontend/`
- Backend: Flask 3 app factory in `backend/`
- Gateway: nginx via `docker-compose.yml`
- Recipe API integration: Spoonacular via backend proxy
- Primary local entrypoint: `docker compose up --build`

## What Exists Today

- Three working feature cells:
  - `hello`
  - `recipes`
  - `status`
- Frontend landing page in `frontend/src/app/App.jsx`
- Frontend recipe search and save UI is live on the landing page
- Frontend cells under `frontend/src/cells/<cell>/`
- Backend cells under `backend/cells/<cell>/`
- Backend app registration in `backend/app/__init__.py`
- Backend health endpoint at `GET /api/health`
- Repo-root `.env` stores `SPOONACULAR_API_KEY` for local Docker runs

## Important Files

- `README.md`: high-level project intent and cellular pattern
- `docker-compose.yml`: runs frontend on `5173`, backend on `5000`, gateway on `8080`
- `frontend/src/app/App.jsx`: current landing page composition
- `frontend/src/styles.css`: current earthy farmhouse theme
- `frontend/src/cells/hello/api/fetchHello.js`
- `frontend/src/cells/hello/components/HelloPanel.jsx`
- `frontend/src/cells/status/api/fetchStatus.js`
- `frontend/src/cells/status/components/StatusCard.jsx`
- `frontend/src/cells/recipes/api/fetchRecipeSearch.js`
- `frontend/src/cells/recipes/api/fetchSavedRecipes.js`
- `frontend/src/cells/recipes/api/saveRecipe.js`
- `frontend/src/cells/recipes/components/RecipeExplorer.jsx`
- `backend/app/__init__.py`: app factory and blueprint registration
- `backend/cells/hello/routes.py`
- `backend/cells/hello/service.py`
- `backend/cells/recipes/routes.py`
- `backend/cells/recipes/service.py`
- `backend/cells/status/routes.py`
- `backend/cells/status/service.py`
- `backend/tests/test_hello.py`
- `backend/tests/test_recipes.py`
- `backend/tests/test_status.py`
- `backend/run.py`: Flask entrypoint
- `.env.example`: local secret template

## Run And Verify

- Full app: `docker compose up --build`
- App URL: `http://localhost:8080`
- Backend direct: `http://localhost:5000`
- Frontend dev server: `http://localhost:5173`
- Spoonacular backend env: `SPOONACULAR_API_KEY`
- Repo-root `.env` is the expected local source for backend secrets in Docker Compose
- `backend/run.py` also loads the repo-root `.env` on startup for direct backend runs

Likely useful checks for future work:

- Frontend install/build: `cd frontend && npm install && npm run build`
- Backend install/test: `cd backend && pip install -r requirements.txt && pytest`

## Architecture Notes

- The frontend is organized by feature cell, not by generic component buckets.
- The backend follows the same cell split, with each cell owning routes and service logic.
- `backend/app/__init__.py` is the integration point where new cell blueprints are registered.
- `App.jsx` currently fetches `hello` and `status` on mount and renders both cells on the landing page.
- `App.jsx` also loads saved recipes on mount and submits recipe searches on demand.
- CORS headers are applied globally in the Flask app factory.
- The recipes search is proxied through Flask using Spoonacular's `recipes/complexSearch` endpoint, then each hit is enriched with recipe information to expose ingredient lists.
- The backend currently uses browser-like request headers for Spoonacular because plain default Python request behavior was rejected with upstream `403` / `1010`.
- Saved recipes are in-memory only for now and will reset when the backend restarts.
- The frontend theme is currently soft, earthy, and farmhouse-inspired: warm cream backgrounds, dusty sage accents, and muted brown calls to action.

## Starting Point For Future Work

When continuing work, inspect these first:

1. `README.md`
2. `docker-compose.yml`
3. `frontend/src/app/App.jsx`
4. `backend/app/__init__.py`

Then determine whether the change is:

- A new cell
- An update to an existing cell
- A layout/styling pass on the landing page
- API/integration cleanup
- A persistence upgrade for saved recipes

For a new cell, use this pattern:

1. Add frontend files under `frontend/src/cells/<name>/`
2. Add backend files under `backend/cells/<name>/`
3. Register the backend blueprint in `backend/app/__init__.py`
4. Render the new cell from `frontend/src/app/App.jsx` or from a routed page shell
5. Add backend tests in `backend/tests/`

## Practical Guidance For Codex

- Prefer minimal, cell-scoped changes over cross-cutting refactors.
- Preserve the existing React/Vite and Flask structure unless the task clearly requires a larger reorganization.
- If adding backend dependencies, update `backend/requirements.txt`.
- If adding frontend dependencies, update `frontend/package.json`.
- Keep landing-page changes consistent with the current cellular framing unless asked to redesign it.
- Preserve the current earthy farmhouse palette unless the user asks for a new visual direction.
- Be careful when changing Spoonacular request parameters or headers; small differences have already caused upstream `403` failures.
- The recipe UI is now more useful when it shows ingredient data rather than sparse metadata like time/servings.
- Watch for generated `__pycache__` content in backend paths; ignore it when reviewing source changes.

## Known Gaps

- No frontend test setup is currently visible.
- Saved recipes are not persisted beyond backend process memory.
- Search currently enriches each Spoonacular result with an additional recipe-information request, which is more useful but may be slower and consume more API quota.
- Local verification may require dependency installation and correct filesystem permissions in the frontend directory.
