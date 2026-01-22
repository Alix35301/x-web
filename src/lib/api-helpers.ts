import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Get cookie header from Next.js request to forward to backend
 */
export function getCookieHeader(request: NextRequest): string {
  return request.headers.get('cookie') || '';
}

/**
 * Handle API errors with proper status codes
 */
export function handleApiError(error: unknown, message = 'An error occurred') {
  console.error(message, error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

/**
 * Return success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
