DO $$ BEGIN
  CREATE TYPE wallet_tx_type AS ENUM ('credit_referral', 'credit_cashback', 'credit_refund', 'credit_manual', 'debit_payment', 'debit_expiry');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS customer_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance_aed decimal(10,2) DEFAULT 0 CHECK (balance_aed >= 0),
  total_earned_aed decimal(10,2) DEFAULT 0,
  total_spent_aed decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES customer_wallets(id),
  type wallet_tx_type NOT NULL,
  amount_aed decimal(10,2) NOT NULL,
  balance_after_aed decimal(10,2) NOT NULL,
  reference_id uuid,
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TRIGGER customer_wallets_updated_at
  BEFORE UPDATE ON customer_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wallet"
  ON customer_wallets FOR SELECT
  USING (customer_id = auth.uid() OR is_admin());

CREATE POLICY "System manages wallets"
  ON customer_wallets FOR ALL
  USING (is_admin());

CREATE POLICY "Users can read own transactions"
  ON wallet_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customer_wallets
      WHERE customer_wallets.id = wallet_transactions.wallet_id
      AND customer_wallets.customer_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "System inserts transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (is_admin());
