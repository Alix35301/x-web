import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);

    const data = await apiClient.get('/api/bank-import/accounts', { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch bank accounts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.post('/api/bank-import/accounts', body, { cookieHeader });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create bank account');
  }
}
