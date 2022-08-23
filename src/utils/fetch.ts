function getHeaders() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = null; // TODO: Add JWT token to headers
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function jsonFetch(url: string, options: RequestInit) {
  const response = await fetch(url, { ...options, headers: getHeaders() });
  const data = await response.json();
  return data;
}
