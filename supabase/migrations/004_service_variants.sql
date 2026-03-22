CREATE TABLE IF NOT EXISTS service_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  variant_label text NOT NULL,
  price_aed decimal(10,2) NOT NULL,
  duration_minutes int NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER service_variants_updated_at
  BEFORE UPDATE ON service_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE service_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active variants"
  ON service_variants FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage variants"
  ON service_variants FOR ALL
  USING (is_admin());
