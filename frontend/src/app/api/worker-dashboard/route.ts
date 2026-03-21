import { proxyToBackend } from "../_lib/proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workerId = searchParams.get("worker_id");

  if (!workerId) {
    return Response.json(
      { success: false, error: "worker_id query parameter is required" },
      { status: 400 },
    );
  }

  return proxyToBackend(request, `/api/worker-dashboard/${encodeURIComponent(workerId)}`, {
    method: "GET",
  });
}
