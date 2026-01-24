import { NextRequest, NextResponse } from "next/server";
import { getCookieHeader, handleApiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const formData = await request.formData();

    // Forward the multipart form data to the backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/bank-import/statement`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload statement');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to upload statement');
  }
}
