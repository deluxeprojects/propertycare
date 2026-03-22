CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  name_ru text,
  name_zh text,
  name_de text,
  description_en text,
  icon_url text,
  image_url text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  seo_title_en text,
  seo_desc_en text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TRIGGER service_categories_updated_at
  BEFORE UPDATE ON service_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON service_categories FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage categories"
  ON service_categories FOR ALL
  USING (is_admin());
