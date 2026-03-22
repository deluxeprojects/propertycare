DO $$ BEGIN
  CREATE TYPE entity_type AS ENUM ('area', 'building', 'service', 'page', 'faq', 'ui_string');
  CREATE TYPE language_code AS ENUM ('en', 'ar', 'ru', 'zh', 'de');
  CREATE TYPE translation_source AS ENUM ('claude_api', 'human_review', 'manual');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type entity_type NOT NULL,
  entity_id uuid NOT NULL,
  field_name varchar(50) NOT NULL,
  language language_code NOT NULL,
  content text NOT NULL,
  source translation_source NOT NULL DEFAULT 'manual',
  humanized boolean NOT NULL DEFAULT false,
  reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id, field_name, language)
);

CREATE TRIGGER translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read translations"
  ON translations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage translations"
  ON translations FOR ALL
  USING (is_admin());
