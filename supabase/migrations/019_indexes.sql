-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE status NOT IN ('completed', 'cancelled', 'refunded');
CREATE INDEX IF NOT EXISTS idx_orders_scheduled ON orders(scheduled_date, scheduled_time_slot);
CREATE INDEX IF NOT EXISTS idx_orders_technician ON orders(assigned_technician_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_orders_area ON orders(area_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- Services
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Pricing
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing_rules(is_active, rule_type) WHERE is_active = true;

-- Promotions
CREATE INDEX IF NOT EXISTS idx_promos_code ON promotions(code) WHERE is_active = true;

-- Technicians
CREATE INDEX IF NOT EXISTS idx_tech_schedule ON technician_schedules(technician_id, date);

-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

-- Areas & Buildings
CREATE INDEX IF NOT EXISTS idx_areas_slug ON areas(slug);
CREATE INDEX IF NOT EXISTS idx_buildings_area ON buildings(area_id);
CREATE INDEX IF NOT EXISTS idx_buildings_slug ON buildings(slug);

-- Translations
CREATE INDEX IF NOT EXISTS idx_translations_entity ON translations(entity_type, entity_id, language);

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);

-- Wallet
CREATE INDEX IF NOT EXISTS idx_wallet_transactions ON wallet_transactions(wallet_id, created_at DESC);
