import { NextResponse } from "next/server";
import { proxyToBackend } from "../_lib/proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Mumbai";
  const platform = searchParams.get("platform") || "Swiggy";

  const weatherRisk = searchParams.get("weather_risk") || "Low";

  const backendPath = `/api/calculate-premium?city=${encodeURIComponent(city)}&platform=${encodeURIComponent(platform)}&weather_risk=${encodeURIComponent(weatherRisk)}`;

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL || process.env.BACKEND_URL || "http://localhost:3001"}${backendPath}`,
        { cache: "no-store" },
      );

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch {
      return NextResponse.json(
        { success: false, error: "Backend service unavailable. Please ensure the backend is running." },
        { status: 502 },
      );
    }
  }

  return proxyToBackend(request, backendPath, { method: "GET" });
}
