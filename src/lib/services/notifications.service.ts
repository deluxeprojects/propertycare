import { sendWhatsApp as twilioWhatsApp } from '@/lib/twilio/whatsapp';

interface NotificationPayload {
  to: string; // phone or email
  template: string;
  variables: Record<string, string>;
}

export async function sendWhatsApp(payload: NotificationPayload): Promise<boolean> {
  const message = buildWhatsAppMessage(payload.template, payload.variables);
  return twilioWhatsApp(payload.to, message);
}

function buildWhatsAppMessage(template: string, vars: Record<string, string>): string {
  const templates: Record<string, string> = {
    booking_confirmed: `Hi ${vars['customerName']}, your booking ${vars['orderNumber']} has been confirmed for ${vars['date']} at ${vars['timeSlot']}. Service: ${vars['serviceName']}. Total: AED ${vars['total']}.`,
    review_request: `Hi ${vars['customerName']}, your ${vars['serviceName']} service (${vars['orderNumber']}) is complete. We'd love your feedback!`,
    amc_renewal: `Hi ${vars['customerName']}, your ${vars['planName']} plan expires on ${vars['expiryDate']}. Renew now for priority service.`,
  };
  return templates[template] ?? JSON.stringify(vars);
}

export async function sendEmail(payload: NotificationPayload): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    // Email service not configured — silently skip in development
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@prokeep.ae',
        to: payload.to,
        subject: payload.variables['subject'] ?? 'Notification',
        html: buildEmailHtml(payload.template, payload.variables),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Email] Failed:', error);
    return false;
  }
}

function buildEmailHtml(template: string, vars: Record<string, string>): string {
  const templates: Record<string, string> = {
    booking_confirmed: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${vars['customerName']},</p>
      <p>Your booking <strong>${vars['orderNumber']}</strong> has been confirmed.</p>
      <p><strong>Service:</strong> ${vars['serviceName']}</p>
      <p><strong>Date:</strong> ${vars['date']}</p>
      <p><strong>Time:</strong> ${vars['timeSlot']}</p>
      <p><strong>Total:</strong> AED ${vars['total']}</p>
      <p>Our technician will arrive at the scheduled time.</p>
    `,
    review_request: `
      <h2>How was your service?</h2>
      <p>Hi ${vars['customerName']},</p>
      <p>Your recent ${vars['serviceName']} service (${vars['orderNumber']}) has been completed.</p>
      <p>We'd love to hear your feedback. Please rate your experience.</p>
    `,
    amc_renewal: `
      <h2>Your Care Plan is expiring soon</h2>
      <p>Hi ${vars['customerName']},</p>
      <p>Your ${vars['planName']} plan expires on ${vars['expiryDate']}.</p>
      <p>Renew now to keep enjoying priority service and discounts.</p>
    `,
  };

  return templates[template] ?? `<p>${JSON.stringify(vars)}</p>`;
}

export async function notifyOrderConfirmed(order: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderNumber: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  total: string;
}) {
  const variables = {
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    serviceName: order.serviceName,
    date: order.date,
    timeSlot: order.timeSlot,
    total: order.total,
    subject: `Booking Confirmed: ${order.orderNumber}`,
  };

  await Promise.all([
    sendWhatsApp({ to: order.customerPhone, template: 'booking_confirmed', variables }),
    sendEmail({ to: order.customerEmail, template: 'booking_confirmed', variables }),
  ]);
}
