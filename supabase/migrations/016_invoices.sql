DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'void');
  CREATE TYPE payment_record_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE DEFAULT ('INV-' || extract(year from now())::text || '-' || lpad(nextval('invoice_number_seq')::text, 5, '0')),
  order_id uuid REFERENCES orders(id),
  subscription_id uuid REFERENCES amc_subscriptions(id),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  subtotal_aed decimal(10,2) NOT NULL,
  vat_aed decimal(10,2) NOT NULL,
  total_aed decimal(10,2) NOT NULL,
  status invoice_status DEFAULT 'draft',
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  line_items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id),
  amount_aed decimal(10,2) NOT NULL,
  method payment_method NOT NULL DEFAULT 'card_stripe',
  gateway_tx_id text,
  stripe_charge_id text,
  status payment_record_status NOT NULL DEFAULT 'pending',
  refund_amount_aed decimal(10,2) DEFAULT 0,
  refund_reason text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own invoices" ON invoices FOR SELECT USING (customer_id = auth.uid() OR is_admin());
CREATE POLICY "Admins manage invoices" ON invoices FOR ALL USING (is_admin());
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM invoices WHERE invoices.id = payments.invoice_id AND (invoices.customer_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());
