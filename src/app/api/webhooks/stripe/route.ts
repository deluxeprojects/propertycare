import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.order_id;
        if (orderId) {
          const { error } = await supabase
            .from('orders')
            .update({
              payment_status: 'captured',
              payment_intent_id: session.payment_intent as string,
              stripe_checkout_session_id: session.id,
              status: 'confirmed',
            })
            .eq('id', orderId);
          if (error) console.error('[Stripe Webhook] checkout.session.completed update failed:', error.message);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        const orderId = intent.metadata?.order_id;
        if (orderId) {
          const { error } = await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orderId);
          if (error) console.error('[Stripe Webhook] payment_intent.payment_failed update failed:', error.message);
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const orderId = charge.metadata?.order_id;
        if (orderId) {
          const { error } = await supabase
            .from('orders')
            .update({
              payment_status: 'refunded',
              status: 'refunded',
            })
            .eq('id', orderId);
          if (error) console.error('[Stripe Webhook] charge.refunded update failed:', error.message);
        }
        break;
      }
    }
  } catch (e) {
    // Log but still return 200 to Stripe so it doesn't retry indefinitely
    console.error('[Stripe Webhook] Processing error:', e);
  }

  return NextResponse.json({ received: true });
}
