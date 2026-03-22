DO $$ BEGIN
  CREATE TYPE building_type AS ENUM ('tower', 'low_rise', 'villa_compound', 'mixed_use');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid REFERENCES areas(id),
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text,
  description_en text NOT NULL DEFAULT '',
  description_ar text,
  description_ru text,
  developer varchar(100),
  year_built int,
  unit_count_approx int,
  building_type building_type NOT NULL DEFAULT 'tower',
  latitude decimal(10,8) NOT NULL DEFAULT 0,
  longitude decimal(11,8) NOT NULL DEFAULT 0,
  google_place_id varchar(100),
  image_url text,
  image_score decimal(3,1),
  image_source image_source DEFAULT 'manual',
  nearby_places jsonb,
  is_active boolean DEFAULT true,
  noindex boolean DEFAULT false,
  enriched_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TRIGGER buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active buildings"
  ON buildings FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage buildings"
  ON buildings FOR ALL
  USING (is_admin());
