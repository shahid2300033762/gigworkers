import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.BACKEND_URL || "http://localhost:3001";

function getAuthorizationHeader(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization : null;
}

export async function proxyToBackend(
  request: Request,
  pathname: string,
  init: RequestInit = {},
) {
  const authorization = getAuthorizationHeader(request);
  if (!authorization) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", authorization);

  try {
    const response = await fetch(`${BACKEND_URL}${pathname}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`Unexpected backend response for ${pathname}:`, text);
      return NextResponse.json(
        { success: false, error: "Unexpected response from backend." },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Proxy error [${pathname}]:`, error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Backend service unavailable. Please ensure the backend is running.",
      },
      { status: 502 },
    );
  }
}
