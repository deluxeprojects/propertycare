DO $$ BEGIN
  CREATE TYPE rule_type AS ENUM ('area_multiplier', 'time_surcharge', 'surge', 'seasonal', 'building_tier');
  CREATE TYPE modifier_type AS ENUM ('percentage', 'fixed_amount');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rule_type rule_type NOT NULL,
  service_id uuid REFERENCES services(id),
  category_id uuid REFERENCES service_categories(id),
  area_id uuid REFERENCES areas(id),
  building_id uuid REFERENCES buildings(id),
  modifier_type modifier_type NOT NULL,
  modifier_value decimal(10,2) NOT NULL,
  conditions jsonb DEFAULT '{}',
  priority int DEFAULT 0,
  is_stackable boolean DEFAULT false,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER pricing_rules_updated_at
  BEFORE UPDATE ON pricing_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read pricing rules"
  ON pricing_rules FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage pricing rules"
  ON pricing_rules FOR ALL
  USING (is_admin());
