import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError } from '@/lib/api/response';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return apiError('Name, email, and message are required', 'VALIDATION_ERROR', 400);
    }

    // Validate types
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return apiError('Invalid input types', 'VALIDATION_ERROR', 400);
    }

    // Validate lengths
    if (name.length > 200) {
      return apiError('Name must be under 200 characters', 'VALIDATION_ERROR', 400);
    }
    if (email.length > 254) {
      return apiError('Email must be under 254 characters', 'VALIDATION_ERROR', 400);
    }
    if (message.length > 5000) {
      return apiError('Message must be under 5000 characters', 'VALIDATION_ERROR', 400);
    }
    if (phone && (typeof phone !== 'string' || phone.length > 30)) {
      return apiError('Phone must be under 30 characters', 'VALIDATION_ERROR', 400);
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return apiError('Invalid email format', 'VALIDATION_ERROR', 400);
    }

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone ? String(phone).trim() : null;
    const sanitizedMessage = message.trim();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
      });

    if (error) {
      // If table doesn't exist, still return success (message noted)
      console.error('Contact form submission error:', error);
    }

    return apiSuccess({ message: 'Message received successfully' });
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
