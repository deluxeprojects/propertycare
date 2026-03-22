DO $$ BEGIN
  CREATE TYPE price_unit AS ENUM ('per_service', 'per_hour', 'per_sqft', 'per_room');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id),
  slug text NOT NULL UNIQUE,
  service_code text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  name_ru text,
  name_zh text,
  name_de text,
  short_desc_en text,
  long_desc_en text,
  base_price_aed decimal(10,2) NOT NULL,
  price_unit price_unit NOT NULL DEFAULT 'per_service',
  duration_minutes int NOT NULL DEFAULT 60,
  min_booking_hours int DEFAULT 24,
  max_reschedules int DEFAULT 2,
  requires_assessment boolean DEFAULT false,
  is_express_available boolean DEFAULT false,
  express_surcharge_pct decimal(5,2) DEFAULT 50.00,
  icon_url text,
  image_url text,
  gallery_urls text[],
  tags text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_hidden boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible services"
  ON services FOR SELECT
  USING ((is_active = true AND is_hidden = false) OR is_admin());

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  USING (is_admin());
