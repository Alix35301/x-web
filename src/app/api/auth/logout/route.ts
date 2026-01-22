import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Clear auth cookies
    cookieStore.delete('session_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({
      message: 'Logout successful',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
