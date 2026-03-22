import twilio from 'twilio';

let _client: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!_client) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) throw new Error('Twilio credentials not configured');
    _client = twilio(sid, token);
  }
  return _client;
}
