import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/services/stripe.service';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { orderId } = await request.json();
    if (!orderId) return apiError('orderId required', 'VALIDATION_ERROR', 400);

    // Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('id, total_amount_aed, services(name_en)')
      .eq('id', orderId)
      .eq('customer_id', user.id)
      .single();

    if (!order) return apiError('Order not found', 'NOT_FOUND', 404);

    const serviceName = (order.services as unknown as { name_en: string } | null)?.name_en ?? 'Service';
    const origin = request.headers.get('origin') ?? 'https://prokeep.ae';

    const session = await createCheckoutSession({
      orderId: order.id,
      customerId: user.id,
      serviceName,
      totalAed: order.total_amount_aed,
      successUrl: `${origin}/book?step=8&session={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/book?step=7`,
    });

    return apiSuccess({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Checkout failed';
    return apiError(message, 'PAYMENT_FAILED', 500);
  }
}
