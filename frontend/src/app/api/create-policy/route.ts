import { proxyToBackend } from "../_lib/proxy";

export async function POST(request: Request) {
  const body = await request.text();

  return proxyToBackend(request, "/api/create-policy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
