import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);

    const data = await apiClient.get('/api/bank-import/category-rules', { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch category rules');
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.post('/api/bank-import/category-rules', body, { cookieHeader });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create category rule');
  }
}
