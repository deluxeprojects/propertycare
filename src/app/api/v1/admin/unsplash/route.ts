import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchUnsplashImage } from '@/lib/unsplash/client';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    if (!query) return apiError('Query required', 'VALIDATION_ERROR', 400);

    const imageUrl = await searchUnsplashImage(query);
    return apiSuccess({ imageUrl, query });
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
