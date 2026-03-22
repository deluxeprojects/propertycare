DO $$ BEGIN
  CREATE TYPE amc_tier AS ENUM ('essential', 'standard', 'premium', 'vip');
  CREATE TYPE unit_type AS ENUM ('studio', '1br', '2br', '3br', '4br', '5br_plus', 'villa_small', 'villa_medium', 'villa_large');
  CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'expired', 'cancelled', 'pending_renewal');
  CREATE TYPE billing_cycle AS ENUM ('monthly', 'quarterly', 'annually');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS amc_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  tier amc_tier NOT NULL UNIQUE,
  description_en text,
  included_services jsonb NOT NULL DEFAULT '[]',
  response_time_hours int NOT NULL DEFAULT 24,
  priority_level int NOT NULL DEFAULT 1,
  discount_on_extras_pct decimal(5,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS amc_plan_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES amc_plans(id),
  unit_type unit_type NOT NULL,
  annual_price_aed decimal(10,2) NOT NULL,
  monthly_price_aed decimal(10,2) NOT NULL,
  quarterly_price_aed decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(plan_id, unit_type)
);

CREATE TABLE IF NOT EXISTS amc_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  plan_id uuid NOT NULL REFERENCES amc_plans(id),
  plan_pricing_id uuid NOT NULL REFERENCES amc_plan_pricing(id),
  address_id uuid REFERENCES customer_addresses(id),
  status subscription_status NOT NULL DEFAULT 'active',
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  next_billing_date date,
  auto_renew boolean DEFAULT true,
  visits_used jsonb DEFAULT '{}',
  payment_method text,
  total_paid_aed decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER amc_plans_updated_at BEFORE UPDATE ON amc_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER amc_plan_pricing_updated_at BEFORE UPDATE ON amc_plan_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER amc_subscriptions_updated_at BEFORE UPDATE ON amc_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE amc_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_plan_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active plans" ON amc_plans FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage plans" ON amc_plans FOR ALL USING (is_admin());
CREATE POLICY "Public can read plan pricing" ON amc_plan_pricing FOR SELECT USING (true);
CREATE POLICY "Admins manage plan pricing" ON amc_plan_pricing FOR ALL USING (is_admin());
CREATE POLICY "Users read own subscriptions" ON amc_subscriptions FOR SELECT USING (customer_id = auth.uid() OR is_admin());
CREATE POLICY "Admins manage subscriptions" ON amc_subscriptions FOR ALL USING (is_admin());
