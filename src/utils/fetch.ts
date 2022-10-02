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
//http://92.247.54.172:8080
export async function jsonFetch(url: string, options?: RequestInit) {
  const session = await getSession();
  const response = await fetch(`http://207.154.235.250:8080/${url}`, {
    ...options,
    headers: getHeaders(session?.accessToken),
  });
  // if (!response.ok) {
  //   console.log(response);
  //   if (response.status === 403) {
  //     router.push("/auth/login");
  //   }
  // }
  const data = await response.json();
  return data;
}
