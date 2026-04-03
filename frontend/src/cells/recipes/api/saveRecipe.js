const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export async function saveRecipe(recipe) {
  const response = await fetch(`${apiBaseUrl}/recipes/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Recipe save failed");
  }

  return payload;
}
