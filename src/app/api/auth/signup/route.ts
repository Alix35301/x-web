import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-helpers';
import apiClient from '@/lib/api-client';
import { cookies } from 'next/headers';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Call backend API for signup
    const response = await apiClient.post('/api/auth/signup', validatedData) as {
      token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        name?: string;
      };
    };

    // Store tokens in cookies
    const cookieStore = await cookies();
    cookieStore.set('session_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    cookieStore.set('refresh_token', response.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      message: 'Signup successful',
      user: response.user,
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create user');
  }
}
