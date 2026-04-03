import { RecipeExplorer } from "../../cells/recipes/components/RecipeExplorer";

export function HomePage({
  onNavigate,
  onSearch,
  onSave,
  query,
  setQuery,
  results,
  savedRecipes,
  searchError,
  saveError,
  isSearching,
  isSavingRecipeId,
  selectedSavedRecipe,
  onSelectSavedRecipe,
  onCloseSavedRecipe,
  onCopyIngredients,
  onCopyInstructions,
  copyFeedback,
}) {
  return (
    <main className="shell">
      <header className="topbar">
        <span className="topbar-link active">Recipes</span>
        <button className="topbar-link" type="button" onClick={() => onNavigate("/admin")}>
          Admin
        </button>
      </header>

      <section className="recipe-hero panel">
        <p className="eyebrow">Recipe Collection</p>
        <h1>Search recipes and keep the ones you want to cook.</h1>
        <p className="lede">
          The main page is now focused on the working recipe flow: search,
          review ingredients, save recipes, and reopen details from your
          collection.
        </p>
      </section>

      <RecipeExplorer
        onSearch={onSearch}
        onSave={onSave}
        query={query}
        setQuery={setQuery}
        results={results}
        savedRecipes={savedRecipes}
        searchError={searchError}
        saveError={saveError}
        isSearching={isSearching}
        isSavingRecipeId={isSavingRecipeId}
        selectedSavedRecipe={selectedSavedRecipe}
        onSelectSavedRecipe={onSelectSavedRecipe}
        onCloseSavedRecipe={onCloseSavedRecipe}
        onCopyIngredients={onCopyIngredients}
        onCopyInstructions={onCopyInstructions}
        copyFeedback={copyFeedback}
      />
    </main>
  );
}
