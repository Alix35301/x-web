import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);

    const data = await apiClient.get('/api/bank-import/history', { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch import history');
  }
}
