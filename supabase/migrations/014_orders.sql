DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled', 'refunded', 'disputed');
  CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded');
  CREATE TYPE payment_method AS ENUM ('card_stripe', 'card_tabby', 'cash', 'bank_transfer', 'wallet');
  CREATE TYPE cancelled_by_type AS ENUM ('customer', 'admin', 'system');
  CREATE TYPE order_source AS ENUM ('website', 'whatsapp', 'phone', 'admin', 'api');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Order number sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('LH-' || extract(year from now())::text || '-' || lpad(nextval('order_number_seq')::text, 5, '0')),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  status order_status NOT NULL DEFAULT 'pending',
  service_id uuid NOT NULL REFERENCES services(id),
  variant_id uuid REFERENCES service_variants(id),
  scheduled_date date NOT NULL,
  scheduled_time_slot text NOT NULL,
  actual_start_at timestamptz,
  actual_end_at timestamptz,
  address_id uuid REFERENCES customer_addresses(id),
  area_id uuid REFERENCES areas(id),
  building_id uuid REFERENCES buildings(id),
  assigned_technician_id uuid REFERENCES profiles(id),
  base_amount_aed decimal(10,2) NOT NULL,
  addons_amount_aed decimal(10,2) DEFAULT 0,
  pricing_adjustments_aed decimal(10,2) DEFAULT 0,
  discount_amount_aed decimal(10,2) DEFAULT 0,
  express_surcharge_aed decimal(10,2) DEFAULT 0,
  vat_amount_aed decimal(10,2) DEFAULT 0,
  total_amount_aed decimal(10,2) NOT NULL,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id text,
  stripe_checkout_session_id text,
  promotion_id uuid REFERENCES promotions(id),
  notes_customer text,
  notes_internal text,
  rating int CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  cancellation_reason text,
  cancelled_by cancelled_by_type,
  source order_source DEFAULT 'website',
  is_express boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  recurring_schedule_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  addon_id uuid NOT NULL REFERENCES service_addons(id),
  quantity int DEFAULT 1,
  unit_price_aed decimal(10,2) NOT NULL,
  total_price_aed decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Auto-track status changes
CREATE OR REPLACE FUNCTION track_order_status()
RETURNS trigger AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status::text, NEW.status::text, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION track_order_status();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid() OR assigned_technician_id = auth.uid() OR is_admin());

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id = auth.uid() OR is_admin());

CREATE POLICY "Admins and techs can update orders"
  ON orders FOR UPDATE
  USING (is_admin() OR assigned_technician_id = auth.uid());

CREATE POLICY "Read order addons"
  ON order_addons FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_addons.order_id AND (orders.customer_id = auth.uid() OR is_admin()))
  );

CREATE POLICY "Insert order addons"
  ON order_addons FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Read order history"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND (orders.customer_id = auth.uid() OR is_admin()))
  );

CREATE POLICY "Insert order history"
  ON order_status_history FOR INSERT
  WITH CHECK (true);
