import { NextRequest } from "next/server";
export function getPagination(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);

  return { page, limit };
}
