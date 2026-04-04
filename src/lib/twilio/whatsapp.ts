import { getTwilioClient } from './client';

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient();
    const rawFrom = process.env.TWILIO_WHATSAPP_FROM ?? '+14155238886';
    // Ensure we don't double-prefix with 'whatsapp:'
    const from = rawFrom.startsWith('whatsapp:') ? rawFrom : `whatsapp:${rawFrom}`;
    const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    await client.messages.create({
      from,
      to: toFormatted,
      body: message,
    });
    return true;
  } catch (error) {
    console.error('[WhatsApp] Send failed:', error);
    return false;
  }
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient();
    const from = process.env.TWILIO_SMS_FROM ?? process.env.TWILIO_PHONE_NUMBER;
    if (!from) throw new Error('TWILIO_SMS_FROM not set');

    await client.messages.create({
      from,
      to,
      body: message,
    });
    return true;
  } catch (error) {
    console.error('[SMS] Send failed:', error);
    return false;
  }
}
