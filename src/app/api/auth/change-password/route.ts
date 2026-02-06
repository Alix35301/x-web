import { NextRequest, NextResponse } from 'next/server';
import { getCookieHeader, handleApiError } from '@/lib/api-helpers';
import apiClient from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);
    const body = await request.json();

    const data = await apiClient.post('/api/auth/change-password', body, {
      cookieHeader,
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to change password');
  }
}
