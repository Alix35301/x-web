import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-helpers';
import apiClient from '@/lib/api-client';

const confirmResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = confirmResetSchema.parse(body);

    // Call backend API to confirm password reset
    const response = await apiClient.post('/api/auth/reset-password/confirm', validatedData);

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error, 'Failed to reset password');
  }
}
