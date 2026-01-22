import { NextRequest, NextResponse } from 'next/server';
import { getCookieHeader, handleApiError } from '@/lib/api-helpers';
import apiClient from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = getCookieHeader(request);

    // Call backend to get current user info
    const data = await apiClient.get('/api/auth/me', { cookieHeader });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
}
