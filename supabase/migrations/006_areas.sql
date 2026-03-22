DO $$ BEGIN
  CREATE TYPE area_priority AS ENUM ('p0_launch', 'p1_month2', 'p2_month4');
  CREATE TYPE image_source AS ENUM ('google_places', 'unsplash', 'manual', 'area_fallback');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  name_ru text,
  name_zh text,
  name_de text,
  zone_group varchar(50) NOT NULL,
  description_en text NOT NULL DEFAULT '',
  description_ar text,
  description_ru text,
  description_zh text,
  description_de text,
  latitude decimal(10,8) NOT NULL DEFAULT 0,
  longitude decimal(11,8) NOT NULL DEFAULT 0,
  image_url text,
  image_source image_source DEFAULT 'manual',
  approximate_units int,
  property_types text[] NOT NULL DEFAULT '{}',
  nearby_places jsonb,
  meta_title_en varchar(70),
  meta_desc_en varchar(160),
  is_active boolean DEFAULT true,
  priority area_priority NOT NULL DEFAULT 'p0_launch',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TRIGGER areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active areas"
  ON areas FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage areas"
  ON areas FOR ALL
  USING (is_admin());
