DO $$ BEGIN
  CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contractor');
  CREATE TYPE vehicle_type AS ENUM ('car', 'van', 'motorcycle', 'none');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES profiles(id),
  employee_code text NOT NULL UNIQUE,
  specializations uuid[],
  certifications jsonb DEFAULT '[]',
  avg_rating decimal(3,2) DEFAULT 0,
  total_jobs int DEFAULT 0,
  daily_capacity int DEFAULT 6,
  work_areas uuid[],
  employment_type employment_type NOT NULL DEFAULT 'full_time',
  hourly_rate_aed decimal(10,2),
  commission_pct decimal(5,2) DEFAULT 0,
  is_available boolean DEFAULT true,
  current_lat decimal(10,8),
  current_lng decimal(11,8),
  vehicle_type vehicle_type DEFAULT 'none',
  vehicle_plate text,
  emergency_contact jsonb,
  bank_details jsonb,
  joined_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS technician_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid NOT NULL REFERENCES technicians(id),
  date date NOT NULL,
  available_from time NOT NULL DEFAULT '08:00',
  available_until time NOT NULL DEFAULT '22:00',
  break_start time,
  break_end time,
  is_day_off boolean DEFAULT false,
  day_off_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(technician_id, date)
);

CREATE TRIGGER technicians_updated_at
  BEFORE UPDATE ON technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER technician_schedules_updated_at
  BEFORE UPDATE ON technician_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own tech can read own record"
  ON technicians FOR SELECT
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can manage technicians"
  ON technicians FOR ALL
  USING (is_admin());

CREATE POLICY "Own tech can read own schedule"
  ON technician_schedules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM technicians WHERE technicians.id = technician_schedules.technician_id AND technicians.profile_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Admins can manage schedules"
  ON technician_schedules FOR ALL
  USING (is_admin());
