import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);

    const data = await apiClient.get('/api/category', { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.post('/api/category', body, { cookieHeader });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create category');
  }
}
