import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['super_admin', 'admin', 'manager'].includes(profile.role)) {
      return apiError('Forbidden', 'FORBIDDEN', 403);
    }

    const body = await request.json();
    const { title, slug, content, excerpt, category, meta_title, meta_description, status, published_at } = body;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return apiError('Title, slug, and content are required', 'VALIDATION_ERROR', 400);
    }

    const { data, error } = await supabase.from('blog_posts').insert({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      category: category || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      status: status || 'draft',
      published_at: published_at || null,
    }).select().single();

    if (error) return apiError(error.message, 'DB_ERROR', 500);
    return apiSuccess(data, 201);
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
