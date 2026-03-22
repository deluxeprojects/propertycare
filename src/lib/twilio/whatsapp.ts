import { getTwilioClient } from './client';

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient();
    const from = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886';

    await client.messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
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
