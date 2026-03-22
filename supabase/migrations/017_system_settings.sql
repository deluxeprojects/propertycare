CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  category text NOT NULL,
  label text NOT NULL,
  description text,
  is_sensitive boolean DEFAULT false,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read non-sensitive settings" ON system_settings FOR SELECT USING (is_admin());
CREATE POLICY "Super admins manage settings" ON system_settings FOR ALL USING (get_user_role() = 'super_admin');

-- Seed defaults
INSERT INTO system_settings (key, value, category, label, description) VALUES
  ('business.company_name', '"Livio Homes"', 'business', 'Company Name', 'Display name'),
  ('business.company_tagline', '"Home Services Done Right"', 'business', 'Tagline', 'Company tagline'),
  ('business.phone', '"+971-XX-XXX-XXXX"', 'business', 'Phone', 'Contact phone'),
  ('business.email', '"hello@liviohomes.ae"', 'business', 'Email', 'Contact email'),
  ('business.vat_pct', '5', 'business', 'VAT %', 'UAE VAT percentage'),
  ('business.currency', '"AED"', 'business', 'Currency', 'Default currency'),
  ('business.order_prefix', '"LH"', 'business', 'Order Prefix', 'Order number prefix'),
  ('business.invoice_prefix', '"INV"', 'business', 'Invoice Prefix', 'Invoice number prefix'),
  ('business.operating_hours', '{"start":"08:00","end":"22:00"}', 'business', 'Operating Hours', 'Business hours'),
  ('business.time_slots', '["08:00-10:00","10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00","20:00-22:00"]', 'booking', 'Time Slots', 'Available booking slots'),
  ('business.min_advance_hours', '4', 'booking', 'Min Advance Hours', 'Minimum advance booking hours'),
  ('business.max_advance_days', '30', 'booking', 'Max Advance Days', 'Maximum advance booking days'),
  ('business.cancellation_hours', '12', 'booking', 'Cancellation Window', 'Free cancellation hours before service'),
  ('business.cancellation_fee_pct', '25', 'booking', 'Cancellation Fee %', 'Cancellation fee percentage'),
  ('payment.cash_enabled', 'true', 'payment', 'Cash Payments', 'Enable cash payments'),
  ('notification.email_from', '"noreply@liviohomes.ae"', 'notification', 'From Email', 'Notification sender email'),
  ('seo.default_og_image', '"/og-default.jpg"', 'seo', 'OG Image', 'Default Open Graph image')
ON CONFLICT (key) DO NOTHING;
