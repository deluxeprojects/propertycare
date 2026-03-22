CREATE TABLE IF NOT EXISTS service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_ar text,
  name_ru text,
  name_zh text,
  name_de text,
  price_aed decimal(10,2) NOT NULL,
  duration_minutes int DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER service_addons_updated_at
  BEFORE UPDATE ON service_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active addons"
  ON service_addons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage addons"
  ON service_addons FOR ALL
  USING (is_admin());
