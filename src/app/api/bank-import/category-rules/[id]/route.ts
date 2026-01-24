import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";
import apiClient from "@/lib/api-client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.patch(`/api/bank-import/category-rules/${params.id}`, body, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to update category rule');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieHeader = getCookieHeader(request);

    const data = await apiClient.delete(`/api/bank-import/category-rules/${params.id}`, { cookieHeader });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to delete category rule');
  }
}
