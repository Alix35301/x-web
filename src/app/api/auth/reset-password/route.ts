import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-helpers';
import apiClient from '@/lib/api-client';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Call backend API for password reset
    const response = await apiClient.post('/api/auth/reset-password', validatedData);

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error, 'Failed to process password reset request');
  }
}
