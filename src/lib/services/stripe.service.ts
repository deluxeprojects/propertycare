import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getOrCreateStripeCustomer(profileId: string): Promise<string> {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, stripe_customer_id')
    .eq('id', profileId)
    .single();

  if (!profile) throw new Error('Profile not found');

  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: profile.email,
    name: profile.full_name,
    metadata: { supabase_id: profile.id },
  });

  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', profileId);

  return customer.id;
}

export async function createCheckoutSession(params: {
  orderId: string;
  customerId: string;
  serviceName: string;
  totalAed: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripeCustomerId = await getOrCreateStripeCustomer(params.customerId);

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: {
            name: params.serviceName,
          },
          unit_amount: Math.round(params.totalAed * 100), // Stripe uses fils
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      order_id: params.orderId,
      customer_id: params.customerId,
    },
  });

  // Save checkout session ID to order
  const supabase = createAdminClient();
  await supabase
    .from('orders')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', params.orderId);

  return session;
}

// TODO-REVIEW: Add try-catch with AppError wrapping when this is wired to a route.
// Currently unused — callers must handle Stripe errors at the route level.
export async function processRefund(paymentIntentId: string, amount?: number) {
  const refundParams: { payment_intent: string; amount?: number } = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundParams.amount = Math.round(amount * 100);
  }

  const refund = await stripe.refunds.create(refundParams);
  return refund;
}
