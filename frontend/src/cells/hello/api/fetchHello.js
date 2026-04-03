const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchHello() {
  const response = await fetch(`${apiBaseUrl}/hello`);

  if (!response.ok) {
    throw new Error("Hello request failed");
  }

  return response.json();
}
