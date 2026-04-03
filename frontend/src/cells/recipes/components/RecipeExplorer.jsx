export function RecipeExplorer({
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
    <>
      <section className="recipe-section" id="recipes">
        <article className="panel recipe-search-panel">
          <p className="section-label">Recipe Search</p>
          <h2>Search Spoonacular recipes</h2>
          <p className="muted">
            Search by dish, ingredient, or idea, then save recipes you want to
            keep.
          </p>
          <form className="recipe-search-form" onSubmit={onSearch}>
            <input
              className="recipe-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try pasta, salmon, soup, tacos..."
              aria-label="Search recipes"
            />
            <button className="cta" type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
          {searchError ? <p className="error">{searchError}</p> : null}
          <div className="recipe-results">
            {results.length === 0 ? (
              <p className="muted">
                Search for a recipe to load results from Spoonacular.
              </p>
            ) : null}
            {results.map((recipe) => {
              const isSaved = savedRecipes.some((saved) => saved.id === recipe.id);

              return (
                <article className="recipe-card" key={recipe.id}>
                  {recipe.image ? (
                    <img
                      className="recipe-image"
                      src={recipe.image}
                      alt={recipe.title}
                    />
                  ) : null}
                  <div className="recipe-card-body">
                    <h3>{recipe.title}</h3>
                    {recipe.ingredients?.length ? (
                      <ul className="ingredient-list">
                        {recipe.ingredients.map((ingredient) => (
                          <li key={ingredient}>{ingredient}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="recipe-meta">No ingredient list returned.</p>
                    )}
                    {recipe.summary ? (
                      <p className="muted recipe-summary">{recipe.summary}</p>
                    ) : null}
                    <div className="recipe-card-actions">
                      <button
                        className="cta"
                        type="button"
                        onClick={() => onSave(recipe)}
                        disabled={isSaved || isSavingRecipeId === recipe.id}
                      >
                        {isSaved
                          ? "Saved"
                          : isSavingRecipeId === recipe.id
                            ? "Saving..."
                            : "Save recipe"}
                      </button>
                      {recipe.sourceUrl ? (
                        <a
                          className="cta secondary"
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open source
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <article className="panel accent recipe-saved-panel">
          <p className="section-label">Saved Recipes</p>
          <h2>Starter collection</h2>
          <p className="muted">
            Saved recipes are stored in the Flask process for now.
          </p>
          {saveError ? <p className="error">{saveError}</p> : null}
          {savedRecipes.length === 0 ? (
            <p className="muted">No saved recipes yet.</p>
          ) : (
            <div className="saved-list">
              {savedRecipes.map((recipe) => (
                <button
                  className="saved-recipe"
                  key={recipe.id}
                  type="button"
                  onClick={() => onSelectSavedRecipe(recipe)}
                >
                  {recipe.image ? (
                    <img
                      className="saved-recipe-image"
                      src={recipe.image}
                      alt={recipe.title}
                    />
                  ) : null}
                  <div className="saved-recipe-copy">
                    <h3>{recipe.title}</h3>
                    {recipe.summary ? (
                      <p className="recipe-meta saved-summary">{recipe.summary}</p>
                    ) : (
                      <p className="recipe-meta saved-summary">
                        Open for ingredients and instructions.
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </article>
      </section>

      {selectedSavedRecipe ? (
        <div className="recipe-modal-backdrop" onClick={onCloseSavedRecipe}>
          <dialog className="recipe-modal" open onClick={(event) => event.stopPropagation()}>
            <div className="recipe-modal-header">
              <div>
                <p className="section-label">Saved Recipe</p>
                <h2>{selectedSavedRecipe.title}</h2>
              </div>
              <button className="recipe-modal-close" type="button" onClick={onCloseSavedRecipe}>
                Close
              </button>
            </div>
            {copyFeedback ? <p className="recipe-copy-feedback">{copyFeedback}</p> : null}
            <section className="recipe-modal-section">
              <div className="recipe-modal-section-head">
                <h3>Ingredients</h3>
                <button
                  className="cta secondary"
                  type="button"
                  onClick={() => onCopyIngredients(selectedSavedRecipe)}
                  disabled={!selectedSavedRecipe.ingredients?.length}
                >
                  Copy ingredients
                </button>
              </div>
              {selectedSavedRecipe.ingredients?.length ? (
                <ul className="ingredient-list modal-ingredient-list">
                  {selectedSavedRecipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No ingredients available.</p>
              )}
            </section>
            <section className="recipe-modal-section">
              <div className="recipe-modal-section-head">
                <h3>Instructions</h3>
                <button
                  className="cta secondary"
                  type="button"
                  onClick={() => onCopyInstructions(selectedSavedRecipe)}
                  disabled={!selectedSavedRecipe.instructions}
                >
                  Copy instructions
                </button>
              </div>
              {selectedSavedRecipe.instructions ? (
                <pre className="recipe-instructions">{selectedSavedRecipe.instructions}</pre>
              ) : (
                <p className="muted">No instructions available.</p>
              )}
            </section>
          </dialog>
        </div>
      ) : null}
    </>
  );
}
