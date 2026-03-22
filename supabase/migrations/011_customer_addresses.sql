CREATE TABLE IF NOT EXISTS customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label text DEFAULT 'Home',
  area_id uuid REFERENCES areas(id),
  building_id uuid REFERENCES buildings(id),
  building_name text,
  unit_number text,
  floor text,
  street_address text,
  lat decimal(10,8),
  lng decimal(11,8),
  google_place_id text,
  special_instructions text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER customer_addresses_updated_at
  BEFORE UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own addresses"
  ON customer_addresses FOR SELECT
  USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "Users can manage own addresses"
  ON customer_addresses FOR INSERT
  WITH CHECK (customer_id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own addresses"
  ON customer_addresses FOR UPDATE
  USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "Users can delete own addresses"
  ON customer_addresses FOR DELETE
  USING (customer_id = auth.uid() OR is_admin());
