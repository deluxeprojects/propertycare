-- Daily revenue materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_revenue AS
SELECT
  date_trunc('day', o.created_at)::date AS day,
  COUNT(*) AS order_count,
  SUM(o.total_amount_aed) AS total_revenue,
  AVG(o.total_amount_aed) AS avg_order_value,
  COUNT(DISTINCT o.customer_id) AS unique_customers
FROM orders o
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY date_trunc('day', o.created_at)::date
ORDER BY day DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_revenue_day ON daily_revenue(day);

-- Service popularity
CREATE MATERIALIZED VIEW IF NOT EXISTS service_popularity AS
SELECT
  s.id AS service_id,
  s.name_en,
  sc.name_en AS category_name,
  COUNT(o.id) AS order_count,
  SUM(o.total_amount_aed) AS total_revenue,
  AVG(o.rating) AS avg_rating
FROM services s
LEFT JOIN orders o ON o.service_id = s.id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN service_categories sc ON s.category_id = sc.id
GROUP BY s.id, s.name_en, sc.name_en;

CREATE UNIQUE INDEX IF NOT EXISTS idx_service_popularity_id ON service_popularity(service_id);

-- Technician performance
CREATE MATERIALIZED VIEW IF NOT EXISTS technician_performance AS
SELECT
  t.id AS technician_id,
  p.full_name,
  t.employee_code,
  COUNT(o.id) AS total_jobs,
  AVG(o.rating) AS avg_rating,
  COUNT(CASE WHEN o.rating >= 4 THEN 1 END) AS positive_ratings,
  SUM(o.total_amount_aed) AS total_revenue_generated
FROM technicians t
JOIN profiles p ON t.profile_id = p.id
LEFT JOIN orders o ON o.assigned_technician_id = t.profile_id AND o.status = 'completed'
GROUP BY t.id, p.full_name, t.employee_code;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tech_performance_id ON technician_performance(technician_id);
