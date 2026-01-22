import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const searchParams = request.nextUrl.searchParams;

    // Build query string from search params
    const queryString = searchParams.toString();
    const endpoint = `/api/expense${queryString ? `?${queryString}` : ''}`;

    const data = await apiClient.get(endpoint, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch expenses');
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.post('/api/expense', body, { cookieHeader });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create expense');
  }
}
