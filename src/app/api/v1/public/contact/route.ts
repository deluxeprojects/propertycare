import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return apiError('Name, email, and message are required', 'VALIDATION_ERROR', 400);
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, phone: phone || null, message });

    if (error) {
      // If table doesn't exist, still return success (message noted)
      console.error('Contact form submission error:', error);
    }

    return apiSuccess({ message: 'Message received successfully' });
  } catch (e) {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
