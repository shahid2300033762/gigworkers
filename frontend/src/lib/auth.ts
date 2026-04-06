"use client";

import { supabase } from "./supabase";

export async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    return null;
  }

  return session.access_token;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const accessToken = await getAccessToken();
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Ensure relative paths are prepended with the backend URL
  const url = input.startsWith("http") ? input : `${backendUrl}${input}`;

  return fetch(url, {
    ...init,
    headers,
  });
}
