import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/api-helpers';
import apiClient from "@/lib/api-client";

type LoginResponse = {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email: body.email,
      password: body.password
    });


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
      message: 'Login successful',
      user: response.user,
    }, { status: 200 });
  } catch (error) {
    console.log('error', error)
    return handleApiError(error, 'Login failed');

  }
}
