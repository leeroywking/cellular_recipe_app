import { useEffect, useState } from "react";
import { fetchHello } from "../cells/hello/api/fetchHello";
import { fetchRecipeSearch } from "../cells/recipes/api/fetchRecipeSearch";
import { fetchSavedRecipes } from "../cells/recipes/api/fetchSavedRecipes";
import { saveRecipe } from "../cells/recipes/api/saveRecipe";
import { fetchStatus } from "../cells/status/api/fetchStatus";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
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
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    let active = true;

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

  useEffect(() => {
    if (pathname !== "/admin") {
      return undefined;
    }

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

    return () => {
      active = false;
    };
  }, [pathname]);

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

  function handleNavigate(nextPath) {
    if (nextPath === pathname) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
    setSelectedSavedRecipe(null);
  }

  if (pathname === "/admin") {
    return (
      <AdminPage
        hello={hello}
        helloError={helloError}
        status={status}
        statusError={error}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <HomePage
      onNavigate={handleNavigate}
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
  );
}
