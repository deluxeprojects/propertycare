import { NextRequest } from 'next/server';
import { searchUnsplashImage } from '@/lib/unsplash/client';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  if (!query) return apiError('Query required', 'VALIDATION_ERROR', 400);

  const imageUrl = await searchUnsplashImage(query);
  return apiSuccess({ imageUrl, query });
}
