// Middleware disabled — all route protection is handled client-side by each page's
// useEffect session check (supabase.auth.getSession). This prevents redirect loops
// caused by the mismatch between server-side cookie checks and client-side session storage.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}
