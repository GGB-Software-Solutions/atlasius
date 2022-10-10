import { useRouter } from "next/router";
import { getJwtToken } from "./jwt";

function getHeaders() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = getJwtToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function jsonFetch(url: string, options?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${url}`, {
    ...options,
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 403) {
      window.location.href = "/auth/login";
    }
  }
  const data = await response.json();
  return data;
}
