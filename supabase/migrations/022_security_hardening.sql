-- Security hardening migration
-- Fixes: role injection on signup, overly permissive INSERT policies,
-- profile self-update privilege escalation, technician update scope

-- 1. Fix handle_new_user() to NEVER trust role from signup metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix overly permissive INSERT policies

-- order_addons: only allow insert if user owns the order or is admin
DROP POLICY IF EXISTS "Insert order addons" ON order_addons;
CREATE POLICY "Insert order addons"
  ON order_addons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_addons.order_id
      AND (orders.customer_id = auth.uid() OR is_admin())
    )
  );

-- order_status_history: only admins and assigned technicians
DROP POLICY IF EXISTS "Insert order history" ON order_status_history;
CREATE POLICY "Insert order history"
  ON order_status_history FOR INSERT
  WITH CHECK (is_admin());

-- promotion_usage: only the promo user or admin
DROP POLICY IF EXISTS "System inserts promo usage" ON promotion_usage;
CREATE POLICY "Insert promo usage"
  ON promotion_usage FOR INSERT
  WITH CHECK (user_id = auth.uid() OR is_admin());

-- audit_logs: only admin can insert
DROP POLICY IF EXISTS "System inserts audit logs" ON audit_logs;
CREATE POLICY "Insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (is_admin());

-- 3. Prevent customers from escalating their own role
-- Add a trigger that blocks non-admin users from modifying protected columns
CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS trigger AS $$
BEGIN
  -- If the user is not an admin, prevent changes to sensitive columns
  IF NOT is_admin() THEN
    NEW.role := OLD.role;
    NEW.is_active := OLD.is_active;
    NEW.permissions := OLD.permissions;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_profile_updates ON profiles;
CREATE TRIGGER protect_profile_updates
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();

-- 4. Restrict technician order updates to status-related fields only
DROP POLICY IF EXISTS "Admins and techs can update orders" ON orders;
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

CREATE POLICY "Technicians can update assigned orders"
  ON orders FOR UPDATE
  USING (assigned_technician_id = auth.uid());

-- Use a trigger to protect financial fields from non-admin edits
CREATE OR REPLACE FUNCTION protect_order_financials()
RETURNS trigger AS $$
BEGIN
  IF NOT is_admin() THEN
    NEW.total_amount_aed := OLD.total_amount_aed;
    NEW.base_amount_aed := OLD.base_amount_aed;
    NEW.addons_amount_aed := OLD.addons_amount_aed;
    NEW.discount_amount_aed := OLD.discount_amount_aed;
    NEW.vat_amount_aed := OLD.vat_amount_aed;
    NEW.express_surcharge_aed := OLD.express_surcharge_aed;
    NEW.pricing_adjustments_aed := OLD.pricing_adjustments_aed;
    NEW.payment_status := OLD.payment_status;
    NEW.payment_method := OLD.payment_method;
    NEW.payment_intent_id := OLD.payment_intent_id;
    NEW.customer_id := OLD.customer_id;
    NEW.assigned_technician_id := OLD.assigned_technician_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_order_financial_updates ON orders;
CREATE TRIGGER protect_order_financial_updates
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION protect_order_financials();

-- 5. Add CHECK >= 0 constraints on monetary columns
ALTER TABLE orders ADD CONSTRAINT orders_base_amount_positive CHECK (base_amount_aed >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_addons_amount_positive CHECK (addons_amount_aed >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_express_surcharge_positive CHECK (express_surcharge_aed >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_discount_positive CHECK (discount_amount_aed >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_vat_positive CHECK (vat_amount_aed >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_total_positive CHECK (total_amount_aed >= 0);

ALTER TABLE services ADD CONSTRAINT services_base_price_positive CHECK (base_price_aed >= 0);
ALTER TABLE service_variants ADD CONSTRAINT variants_price_positive CHECK (price_aed >= 0);
ALTER TABLE service_addons ADD CONSTRAINT addons_price_positive CHECK (price_aed >= 0);

ALTER TABLE invoices ADD CONSTRAINT invoices_subtotal_positive CHECK (subtotal_aed >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_vat_positive CHECK (vat_aed >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_total_positive CHECK (total_aed >= 0);

ALTER TABLE promotions ADD CONSTRAINT promotions_discount_positive CHECK (discount_value >= 0);
