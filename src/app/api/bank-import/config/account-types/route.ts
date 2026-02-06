import { NextResponse } from 'next/server';
import apiClient from '@/lib/api-client';
import { handleApiError } from '@/lib/api-helpers';

export async function GET() {
  try {
    const data = await apiClient.get('/api/bank-import/config/account-types');
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch account types');
  }
}
