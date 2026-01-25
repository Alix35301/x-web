import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = getCookieHeader(request);
    const { id } = await params;

    const data = await apiClient.get(`/api/bank-import/accounts/${id}`, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch bank account');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();
    const { id } = await params;

    const data = await apiClient.patch(`/api/bank-import/accounts/${id}`, body, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to update bank account');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = getCookieHeader(request);
    const { id } = await params;

    const data = await apiClient.delete(`/api/bank-import/accounts/${id}`, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to delete bank account');
  }
}
