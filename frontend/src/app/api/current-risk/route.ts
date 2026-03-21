import { proxyToBackend } from "../_lib/proxy";

export async function GET(request: Request) {
  return proxyToBackend(request, "/api/current-risk", {
    method: "GET",
  });
}
