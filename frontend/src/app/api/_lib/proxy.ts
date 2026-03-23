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

  const baseUrl = (BACKEND_URL || "").replace(/\/$/, "");
  const targetUrl = `${baseUrl}${pathname}`;
  
  console.log(`[Proxy] Forwarding ${request.method} ${pathname} to ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      ...init,
      headers,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`[Proxy] Non-JSON response for ${pathname} (${response.status}):`, text.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend error (${response.status}). Please check backend logs.`,
          details: text.substring(0, 100) 
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`[Proxy] Fetch error [${pathname}]:`, error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Backend service unreachable. Please ensure the backend is running and the URL is correct.",
        message: error.message
      },
      { status: 502 },
    );
  }
}
