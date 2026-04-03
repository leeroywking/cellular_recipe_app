const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchSavedRecipes() {
  const response = await fetch(`${apiBaseUrl}/recipes/saved`);

  if (!response.ok) {
    throw new Error("Saved recipes request failed");
  }

  return response.json();
}
