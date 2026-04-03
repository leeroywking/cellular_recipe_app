import { useEffect, useState } from "react";
import { fetchHello } from "../cells/hello/api/fetchHello";
import { HelloPanel } from "../cells/hello/components/HelloPanel";
import { fetchRecipeSearch } from "../cells/recipes/api/fetchRecipeSearch";
import { fetchSavedRecipes } from "../cells/recipes/api/fetchSavedRecipes";
import { saveRecipe } from "../cells/recipes/api/saveRecipe";
import { RecipeExplorer } from "../cells/recipes/components/RecipeExplorer";
import { fetchStatus } from "../cells/status/api/fetchStatus";
import { StatusCard } from "../cells/status/components/StatusCard";

export default function App() {
  const [hello, setHello] = useState(null);
  const [helloError, setHelloError] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [recipeResults, setRecipeResults] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipeSearchError, setRecipeSearchError] = useState("");
  const [recipeSaveError, setRecipeSaveError] = useState("");
  const [isSearchingRecipes, setIsSearchingRecipes] = useState(false);
  const [savingRecipeId, setSavingRecipeId] = useState(null);
  const [selectedSavedRecipe, setSelectedSavedRecipe] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    let active = true;

    fetchHello()
      .then((payload) => {
        if (active) {
          setHello(payload);
        }
      })
      .catch(() => {
        if (active) {
          setHelloError("The hello-world endpoint could not be reached.");
        }
      });

    fetchStatus()
      .then((payload) => {
        if (active) {
          setStatus(payload);
        }
      })
      .catch(() => {
        if (active) {
          setError("The status cell could not reach the backend.");
        }
      });

    fetchSavedRecipes()
      .then((payload) => {
        if (active) {
          setSavedRecipes(payload.saved || []);
        }
      })
      .catch(() => {
        if (active) {
          setRecipeSaveError("Saved recipes could not be loaded.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleRecipeSearch(event) {
    event.preventDefault();
    const nextQuery = recipeQuery.trim();

    if (!nextQuery) {
      setRecipeResults([]);
      setRecipeSearchError("Enter a recipe search before submitting.");
      return;
    }

    setIsSearchingRecipes(true);
    setRecipeSearchError("");

    try {
      const payload = await fetchRecipeSearch(nextQuery);
      setRecipeResults(payload.results || []);
    } catch (searchError) {
      setRecipeSearchError(
        searchError.message || "Recipe search could not reach the backend.",
      );
    } finally {
      setIsSearchingRecipes(false);
    }
  }

  async function handleSaveRecipe(recipe) {
    setSavingRecipeId(recipe.id);
    setRecipeSaveError("");

    try {
      const payload = await saveRecipe(recipe);
      setSavedRecipes(payload.saved || []);
    } catch (saveError) {
      setRecipeSaveError(saveError.message || "Recipe save failed.");
    } finally {
      setSavingRecipeId(null);
    }
  }

  async function handleCopyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${label} copied.`);
      window.setTimeout(() => {
        setCopyFeedback("");
      }, 2000);
    } catch {
      setCopyFeedback(`Could not copy ${label.toLowerCase()}.`);
      window.setTimeout(() => {
        setCopyFeedback("");
      }, 2000);
    }
  }

  return (
    <main className="shell">
      <section className="hero hero-grid">
        <div>
          <p className="eyebrow">Cellular Architecture Starter</p>
          <h1>React at the edge. Flask behind feature cells.</h1>
          <p className="lede">
            A landing-page skeleton backed by isolated frontend and backend
            cells, designed to grow by composition instead of accretion.
          </p>
          <div className="cta-row">
            <a className="cta" href="#overview">
              Explore structure
            </a>
            <a className="cta secondary" href="#api">
              View live API data
            </a>
          </div>
        </div>
        <HelloPanel hello={hello} error={helloError} />
      </section>

      <section className="grid" id="api">
        <StatusCard status={status} error={error} />
        <article className="panel">
          <h2>How this is organized</h2>
          <p>
            The gateway exposes one surface, while each feature cell owns its
            frontend slice and backend capability.
          </p>
          <ul>
            <li>UI lives under <code>frontend/src/cells</code>.</li>
            <li>API cells live under <code>backend/cells</code>.</li>
            <li>Docker keeps edge, client, and API concerns isolated.</li>
          </ul>
        </article>
      </section>

      <RecipeExplorer
        onSearch={handleRecipeSearch}
        onSave={handleSaveRecipe}
        query={recipeQuery}
        setQuery={setRecipeQuery}
        results={recipeResults}
        savedRecipes={savedRecipes}
        searchError={recipeSearchError}
        saveError={recipeSaveError}
        isSearching={isSearchingRecipes}
        isSavingRecipeId={savingRecipeId}
        selectedSavedRecipe={selectedSavedRecipe}
        onSelectSavedRecipe={setSelectedSavedRecipe}
        onCloseSavedRecipe={() => setSelectedSavedRecipe(null)}
        onCopyIngredients={(recipe) =>
          handleCopyText((recipe.ingredients || []).join("\n"), "Ingredients")
        }
        onCopyInstructions={(recipe) =>
          handleCopyText(recipe.instructions || "", "Instructions")
        }
        copyFeedback={copyFeedback}
      />

      <section className="landing-grid" id="overview">
        <article className="panel">
          <p className="section-label">Landing Page</p>
          <h2>Skeleton sections ready to extend</h2>
          <p>
            This page now has a hero area, live backend content, architecture
            summary, and room for additional feature sections.
          </p>
        </article>
        <article className="panel accent">
          <p className="section-label">Next Cells</p>
          <h2>Recipes now have a first live integration</h2>
          <p>
            Search is now routed through Flask, and saved recipes are ready for
            a later persistence layer.
          </p>
        </article>
      </section>
    </main>
  );
}
