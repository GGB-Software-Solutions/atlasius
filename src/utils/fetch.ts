import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

function getHeaders(token: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function jsonFetch(url: string, options?: RequestInit) {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${url}`, {
    ...options,
    headers: getHeaders(session?.accessToken),
  });
  if (!response.ok) {
    if (response.status === 403) {
      window.location.href = "/auth/login";
    }
  }
  const data = await response.json();
  return data;
}
