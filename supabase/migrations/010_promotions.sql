DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_addon', 'free_service');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  description_en text,
  discount_type discount_type NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  min_order_aed decimal(10,2) DEFAULT 0,
  max_discount_aed decimal(10,2),
  applicable_services uuid[] DEFAULT '{}',
  applicable_categories uuid[] DEFAULT '{}',
  applicable_areas uuid[] DEFAULT '{}',
  free_addon_id uuid REFERENCES service_addons(id),
  free_service_id uuid REFERENCES services(id),
  usage_limit_total int,
  usage_limit_per_user int DEFAULT 1,
  usage_count int DEFAULT 0,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
  is_public boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_first_order_only boolean DEFAULT false,
  is_amc_eligible boolean DEFAULT false,
  referral_source_user_id uuid REFERENCES profiles(id),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotion_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  order_id uuid,
  discount_amount_aed decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public active promos"
  ON promotions FOR SELECT
  USING (is_public = true AND is_active = true OR is_admin());

CREATE POLICY "Admins can manage promos"
  ON promotions FOR ALL
  USING (is_admin());

CREATE POLICY "Admins can read promo usage"
  ON promotion_usage FOR SELECT
  USING (is_admin());

CREATE POLICY "System inserts promo usage"
  ON promotion_usage FOR INSERT
  WITH CHECK (true);
