import { proxyToBackend } from "../_lib/proxy";

export async function GET(request: Request) {
  return proxyToBackend(request, "/api/admin-analytics", { method: "GET" });
}
