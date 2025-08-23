import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // For now, just pass through all requests
  // Let individual pages handle their own authentication
  return NextResponse.next()
}
