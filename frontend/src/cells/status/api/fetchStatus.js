const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchStatus() {
  const response = await fetch(`${apiBaseUrl}/status`);

  if (!response.ok) {
    throw new Error("Status request failed");
  }

  return response.json();
}

