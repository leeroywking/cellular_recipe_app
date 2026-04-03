const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchRecipeSearch(query) {
  const response = await fetch(
    `${apiBaseUrl}/recipes/search?q=${encodeURIComponent(query)}`,
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Recipe search failed");
  }

  return payload;
}
