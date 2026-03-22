-- =============================================================================
-- PropertyCare Seed Data
-- Safe to re-run (uses ON CONFLICT)
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. SERVICE CATEGORIES (6)
-- =============================================================================
INSERT INTO service_categories (id, slug, name_en, description_en, sort_order, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'cleaning',     'Cleaning',            'Professional cleaning services for homes and offices', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'ac-services',  'AC Services',         'Air conditioning service, repair, and installation', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'pest-control', 'Pest Control',        'Professional pest management and extermination', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'plumbing',     'Plumbing & Technical','Plumbing, electrical, and handyman services', 4, true),
  ('11111111-1111-1111-1111-111111111105', 'electrical',   'Electrical',          'Electrical repair, installation, and smart home', 5, true),
  ('11111111-1111-1111-1111-111111111106', 'painting',     'Painting & Fit-Out',  'Interior painting, renovation, and fit-out', 6, true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name_en = EXCLUDED.name_en,
  description_en = EXCLUDED.description_en,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- =============================================================================
-- 2. SERVICES (53 total)
-- =============================================================================
-- Cleaning Services (CLN-001 to CLN-010)
INSERT INTO services (id, category_id, slug, service_code, name_en, short_desc_en, base_price_aed, price_unit, duration_minutes, is_express_available, is_featured, is_hidden, sort_order) VALUES
  ('22222222-2222-2222-2222-222222220001', '11111111-1111-1111-1111-111111111101', 'regular-home-cleaning',     'CLN-001', 'Regular Home Cleaning',     'Routine cleaning for apartments and villas',             150.00, 'per_service', 120, true,  true,  false, 1),
  ('22222222-2222-2222-2222-222222220002', '11111111-1111-1111-1111-111111111101', 'deep-cleaning',             'CLN-002', 'Deep Cleaning',             'Thorough top-to-bottom cleaning',                        450.00, 'per_service', 240, true,  true,  false, 2),
  ('22222222-2222-2222-2222-222222220003', '11111111-1111-1111-1111-111111111101', 'move-in-out-cleaning',      'CLN-003', 'Move-In/Out Cleaning',      'Complete cleaning for property handover',                 500.00, 'per_service', 300, false, false, false, 3),
  ('22222222-2222-2222-2222-222222220004', '11111111-1111-1111-1111-111111111101', 'post-construction-cleaning','CLN-004', 'Post-Construction Cleaning','Debris and dust removal after renovation',                600.00, 'per_service', 360, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220005', '11111111-1111-1111-1111-111111111101', 'sofa-cleaning',             'CLN-005', 'Sofa & Upholstery Cleaning','Professional fabric and leather sofa cleaning',           200.00, 'per_service',  90, true,  false, false, 5),
  ('22222222-2222-2222-2222-222222220006', '11111111-1111-1111-1111-111111111101', 'carpet-cleaning',           'CLN-006', 'Carpet & Rug Cleaning',     'Steam cleaning and stain removal for carpets',            150.00, 'per_room',     60, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220007', '11111111-1111-1111-1111-111111111101', 'mattress-cleaning',         'CLN-007', 'Mattress Cleaning',         'Deep sanitization and dust mite treatment',               120.00, 'per_service',  45, false, false, false, 7),
  ('22222222-2222-2222-2222-222222220008', '11111111-1111-1111-1111-111111111101', 'curtain-cleaning',          'CLN-008', 'Curtain & Blind Cleaning',  'On-site and off-site curtain cleaning',                   100.00, 'per_service',  60, false, false, false, 8),
  ('22222222-2222-2222-2222-222222220009', '11111111-1111-1111-1111-111111111101', 'kitchen-deep-cleaning',     'CLN-009', 'Kitchen Deep Cleaning',     'Intensive kitchen degreasing and sanitization',            250.00, 'per_service', 120, true,  false, false, 9),
  ('22222222-2222-2222-2222-222222220010', '11111111-1111-1111-1111-111111111101', 'bathroom-deep-cleaning',    'CLN-010', 'Bathroom Deep Cleaning',    'Descaling, mold treatment, and sanitization',             180.00, 'per_service',  90, true,  false, false, 10),

-- AC Services (AC-001 to AC-008)
  ('22222222-2222-2222-2222-222222220011', '11111111-1111-1111-1111-111111111102', 'ac-general-service',        'AC-001',  'AC General Service',        'Filter cleaning, gas check, and basic maintenance',        80.00, 'per_service',  45, true,  true,  false, 1),
  ('22222222-2222-2222-2222-222222220012', '11111111-1111-1111-1111-111111111102', 'ac-deep-cleaning',          'AC-002',  'AC Deep Cleaning',          'Complete coil cleaning and chemical wash',                 150.00, 'per_service',  90, true,  false, false, 2),
  ('22222222-2222-2222-2222-222222220013', '11111111-1111-1111-1111-111111111102', 'ac-repair',                 'AC-003',  'AC Repair & Troubleshoot',  'Diagnosis and repair of AC issues',                       200.00, 'per_service',  90, true,  false, false, 3),
  ('22222222-2222-2222-2222-222222220014', '11111111-1111-1111-1111-111111111102', 'ac-gas-refill',             'AC-004',  'AC Gas Top-Up / Refill',    'Refrigerant recharge for optimal cooling',                250.00, 'per_service',  60, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220015', '11111111-1111-1111-1111-111111111102', 'ac-installation',           'AC-005',  'AC Installation',           'New unit installation and piping',                        500.00, 'per_service', 180, false, false, false, 5),
  ('22222222-2222-2222-2222-222222220016', '11111111-1111-1111-1111-111111111102', 'ac-duct-cleaning',          'AC-006',  'AC Duct Cleaning',          'Full duct sanitization and deodorizing',                  300.00, 'per_service', 120, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220017', '11111111-1111-1111-1111-111111111102', 'ac-thermostat-install',     'AC-007',  'Thermostat Installation',   'Smart thermostat setup and calibration',                  200.00, 'per_service',  60, false, false, false, 7),
  ('22222222-2222-2222-2222-222222220018', '11111111-1111-1111-1111-111111111102', 'ac-amc',                    'AC-008',  'AC Annual Maintenance',     'Annual maintenance contract for AC units',                800.00, 'per_service',  60, false, false, false, 8),

-- Pest Control (PST-001 to PST-008)
  ('22222222-2222-2222-2222-222222220019', '11111111-1111-1111-1111-111111111103', 'general-pest-control',      'PST-001', 'General Pest Control',      'Treatment for cockroaches, ants, and common pests',       200.00, 'per_service',  60, true,  true,  false, 1),
  ('22222222-2222-2222-2222-222222220020', '11111111-1111-1111-1111-111111111103', 'cockroach-treatment',       'PST-002', 'Cockroach Treatment',       'Gel and spray treatment for cockroach elimination',       180.00, 'per_service',  45, true,  false, false, 2),
  ('22222222-2222-2222-2222-222222220021', '11111111-1111-1111-1111-111111111103', 'bed-bug-treatment',         'PST-003', 'Bed Bug Treatment',         'Heat and chemical treatment for bed bugs',                350.00, 'per_service',  90, false, false, false, 3),
  ('22222222-2222-2222-2222-222222220022', '11111111-1111-1111-1111-111111111103', 'termite-treatment',         'PST-004', 'Termite Treatment',         'Anti-termite barrier and colony elimination',             500.00, 'per_service', 120, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220023', '11111111-1111-1111-1111-111111111103', 'rodent-control',            'PST-005', 'Rodent Control',            'Mouse and rat trapping and prevention',                   250.00, 'per_service',  60, false, false, false, 5),
  ('22222222-2222-2222-2222-222222220024', '11111111-1111-1111-1111-111111111103', 'mosquito-control',          'PST-006', 'Mosquito & Fly Control',    'Fogging and larvicide treatment',                         180.00, 'per_service',  45, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220025', '11111111-1111-1111-1111-111111111103', 'disinfection-service',      'PST-007', 'Disinfection Service',      'Full property sanitization and disinfection',             300.00, 'per_service',  90, true,  true,  false, 7),
  ('22222222-2222-2222-2222-222222220026', '11111111-1111-1111-1111-111111111103', 'snake-scorpion-control',    'PST-008', 'Snake & Scorpion Control',  'Removal and prevention for villas and gardens',           400.00, 'per_service',  90, false, false, false, 8),

-- Plumbing & Technical (PLM-001 to PLM-010)
  ('22222222-2222-2222-2222-222222220027', '11111111-1111-1111-1111-111111111104', 'plumbing-repair',           'PLM-001', 'Plumbing Repair',           'Fix leaks, drips, and pipe issues',                       150.00, 'per_hour',     60, true,  true,  false, 1),
  ('22222222-2222-2222-2222-222222220028', '11111111-1111-1111-1111-111111111104', 'drain-unblocking',          'PLM-002', 'Drain Unblocking',          'Professional drain clearing and jetting',                 200.00, 'per_service',  60, true,  false, false, 2),
  ('22222222-2222-2222-2222-222222220029', '11111111-1111-1111-1111-111111111104', 'water-heater-repair',       'PLM-003', 'Water Heater Repair',       'Repair and maintenance of water heaters',                 200.00, 'per_service',  90, false, false, false, 3),
  ('22222222-2222-2222-2222-222222220030', '11111111-1111-1111-1111-111111111104', 'water-heater-installation', 'PLM-004', 'Water Heater Installation', 'New water heater setup and connection',                   350.00, 'per_service', 120, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220031', '11111111-1111-1111-1111-111111111104', 'toilet-repair',             'PLM-005', 'Toilet Repair',             'Fix flush, seal, and fill valve issues',                  150.00, 'per_service',  60, true,  false, false, 5),
  ('22222222-2222-2222-2222-222222220032', '11111111-1111-1111-1111-111111111104', 'tap-mixer-install',         'PLM-006', 'Tap & Mixer Installation',  'Replace or install kitchen and bathroom taps',            120.00, 'per_service',  45, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220033', '11111111-1111-1111-1111-111111111104', 'water-tank-cleaning',       'PLM-007', 'Water Tank Cleaning',       'Villa water tank sanitization and cleaning',              400.00, 'per_service', 120, false, false, false, 7),
  ('22222222-2222-2222-2222-222222220034', '11111111-1111-1111-1111-111111111104', 'water-pump-repair',         'PLM-008', 'Water Pump Repair',         'Diagnosis and repair of water pump systems',              250.00, 'per_service',  90, false, false, false, 8),
  ('22222222-2222-2222-2222-222222220035', '11111111-1111-1111-1111-111111111104', 'bathroom-renovation',       'PLM-009', 'Bathroom Renovation',       'Complete bathroom remodeling and upgrade',               3000.00, 'per_service', 480, false, false, false, 9),
  ('22222222-2222-2222-2222-222222220036', '11111111-1111-1111-1111-111111111104', 'kitchen-plumbing',          'PLM-010', 'Kitchen Plumbing',          'Sink, disposal, and dishwasher plumbing',                 180.00, 'per_service',  90, false, false, false, 10),

-- Electrical (ELC-001 to ELC-009)
  ('22222222-2222-2222-2222-222222220037', '11111111-1111-1111-1111-111111111105', 'electrical-repair',         'ELC-001', 'Electrical Repair',         'Fix switches, sockets, and wiring issues',                150.00, 'per_hour',     60, true,  true,  false, 1),
  ('22222222-2222-2222-2222-222222220038', '11111111-1111-1111-1111-111111111105', 'light-installation',        'ELC-002', 'Light & Fan Installation',  'Install ceiling lights, chandeliers, and fans',           120.00, 'per_service',  60, false, false, false, 2),
  ('22222222-2222-2222-2222-222222220039', '11111111-1111-1111-1111-111111111105', 'circuit-breaker-repair',    'ELC-003', 'Circuit Breaker Repair',    'Diagnose and fix tripping breakers',                      200.00, 'per_service',  60, true,  false, false, 3),
  ('22222222-2222-2222-2222-222222220040', '11111111-1111-1111-1111-111111111105', 'doorbell-intercom',         'ELC-004', 'Doorbell & Intercom',       'Install or repair doorbells and intercom systems',        150.00, 'per_service',  60, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220041', '11111111-1111-1111-1111-111111111105', 'tv-mounting',               'ELC-005', 'TV Mounting & Setup',       'Wall mount TV and cable management',                      150.00, 'per_service',  60, false, false, false, 5),
  ('22222222-2222-2222-2222-222222220042', '11111111-1111-1111-1111-111111111105', 'smart-home-setup',          'ELC-006', 'Smart Home Setup',          'Configure smart switches, locks, and automation',         300.00, 'per_service', 120, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220043', '11111111-1111-1111-1111-111111111105', 'cctv-installation',         'ELC-007', 'CCTV Installation',         'Security camera setup and network configuration',         400.00, 'per_service', 180, false, false, false, 7),
  ('22222222-2222-2222-2222-222222220044', '11111111-1111-1111-1111-111111111105', 'ev-charger-installation',   'ELC-008', 'EV Charger Installation',   'Electric vehicle charger setup at home',                  800.00, 'per_service', 240, false, false, false, 8),
  ('22222222-2222-2222-2222-222222220045', '11111111-1111-1111-1111-111111111105', 'full-rewiring',             'ELC-009', 'Full Rewiring',             'Complete electrical rewiring for old properties',        2500.00, 'per_service', 480, false, false, false, 9),

-- Painting & Fit-Out (PNT-001 to PNT-008)
  ('22222222-2222-2222-2222-222222220046', '11111111-1111-1111-1111-111111111106', 'interior-painting',         'PNT-001', 'Interior Painting',         'Room and full apartment painting',                         15.00, 'per_sqft',    480, false, true,  false, 1),
  ('22222222-2222-2222-2222-222222220047', '11111111-1111-1111-1111-111111111106', 'accent-wall',               'PNT-002', 'Accent Wall',               'Feature wall painting and design',                        300.00, 'per_service', 180, false, false, false, 2),
  ('22222222-2222-2222-2222-222222220048', '11111111-1111-1111-1111-111111111106', 'wallpaper-installation',    'PNT-003', 'Wallpaper Installation',    'Professional wallpaper hanging and removal',               25.00, 'per_sqft',    240, false, false, false, 3),
  ('22222222-2222-2222-2222-222222220049', '11111111-1111-1111-1111-111111111106', 'villa-exterior-painting',   'PNT-004', 'Villa Exterior Painting',   'Exterior facade and boundary wall painting',               12.00, 'per_sqft',    960, false, false, false, 4),
  ('22222222-2222-2222-2222-222222220050', '11111111-1111-1111-1111-111111111106', 'wood-varnishing',           'PNT-005', 'Wood Varnishing',           'Door, cabinet, and furniture refinishing',                200.00, 'per_service', 120, false, false, false, 5),
  ('22222222-2222-2222-2222-222222220051', '11111111-1111-1111-1111-111111111106', 'false-ceiling',             'PNT-006', 'False Ceiling Installation', 'Gypsum board ceiling design and installation',             35.00, 'per_sqft',    480, false, false, false, 6),
  ('22222222-2222-2222-2222-222222220052', '11111111-1111-1111-1111-111111111106', 'partition-wall',            'PNT-007', 'Partition Wall',            'Gypsum or glass partition installation',                  400.00, 'per_service', 360, false, false, false, 7),
  ('22222222-2222-2222-2222-222222220053', '11111111-1111-1111-1111-111111111106', 'flooring-installation',     'PNT-008', 'Flooring Installation',     'Vinyl, laminate, and tile flooring services',              30.00, 'per_sqft',    480, false, false, false, 8)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  slug = EXCLUDED.slug,
  service_code = EXCLUDED.service_code,
  name_en = EXCLUDED.name_en,
  short_desc_en = EXCLUDED.short_desc_en,
  base_price_aed = EXCLUDED.base_price_aed,
  price_unit = EXCLUDED.price_unit,
  duration_minutes = EXCLUDED.duration_minutes,
  is_express_available = EXCLUDED.is_express_available,
  is_featured = EXCLUDED.is_featured,
  is_hidden = EXCLUDED.is_hidden,
  sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- 3. SERVICE VARIANTS (size-based pricing)
-- =============================================================================

-- Deep Cleaning (CLN-002) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330001', '22222222-2222-2222-2222-222222220002', 'Studio',   450.00, 180, 1),
  ('33333333-3333-3333-3333-333333330002', '22222222-2222-2222-2222-222222220002', '1 BR',     600.00, 240, 2),
  ('33333333-3333-3333-3333-333333330003', '22222222-2222-2222-2222-222222220002', '2 BR',     850.00, 300, 3),
  ('33333333-3333-3333-3333-333333330004', '22222222-2222-2222-2222-222222220002', '3 BR',    1200.00, 360, 4),
  ('33333333-3333-3333-3333-333333330005', '22222222-2222-2222-2222-222222220002', '4 BR+',   1600.00, 420, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- Move-In/Out Cleaning (CLN-003) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330006', '22222222-2222-2222-2222-222222220003', 'Studio',   500.00, 210, 1),
  ('33333333-3333-3333-3333-333333330007', '22222222-2222-2222-2222-222222220003', '1 BR',     650.00, 270, 2),
  ('33333333-3333-3333-3333-333333330008', '22222222-2222-2222-2222-222222220003', '2 BR',     900.00, 330, 3),
  ('33333333-3333-3333-3333-333333330009', '22222222-2222-2222-2222-222222220003', '3 BR',    1300.00, 390, 4),
  ('33333333-3333-3333-3333-333333330010', '22222222-2222-2222-2222-222222220003', '4 BR+',   1800.00, 450, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- Post-Construction Cleaning (CLN-004) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330011', '22222222-2222-2222-2222-222222220004', 'Studio',   600.00, 240, 1),
  ('33333333-3333-3333-3333-333333330012', '22222222-2222-2222-2222-222222220004', '1 BR',     800.00, 300, 2),
  ('33333333-3333-3333-3333-333333330013', '22222222-2222-2222-2222-222222220004', '2 BR',    1100.00, 360, 3),
  ('33333333-3333-3333-3333-333333330014', '22222222-2222-2222-2222-222222220004', '3 BR',    1500.00, 420, 4),
  ('33333333-3333-3333-3333-333333330015', '22222222-2222-2222-2222-222222220004', '4 BR+',   2000.00, 480, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- Regular Home Cleaning (CLN-001) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330016', '22222222-2222-2222-2222-222222220001', 'Studio',   150.00,  90, 1),
  ('33333333-3333-3333-3333-333333330017', '22222222-2222-2222-2222-222222220001', '1 BR',     200.00, 120, 2),
  ('33333333-3333-3333-3333-333333330018', '22222222-2222-2222-2222-222222220001', '2 BR',     280.00, 150, 3),
  ('33333333-3333-3333-3333-333333330019', '22222222-2222-2222-2222-222222220001', '3 BR',     380.00, 180, 4),
  ('33333333-3333-3333-3333-333333330020', '22222222-2222-2222-2222-222222220001', '4 BR+',    500.00, 240, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- General Pest Control (PST-001) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330021', '22222222-2222-2222-2222-222222220019', 'Studio',   200.00,  45, 1),
  ('33333333-3333-3333-3333-333333330022', '22222222-2222-2222-2222-222222220019', '1 BR',     250.00,  60, 2),
  ('33333333-3333-3333-3333-333333330023', '22222222-2222-2222-2222-222222220019', '2 BR',     300.00,  75, 3),
  ('33333333-3333-3333-3333-333333330024', '22222222-2222-2222-2222-222222220019', '3 BR',     400.00,  90, 4),
  ('33333333-3333-3333-3333-333333330025', '22222222-2222-2222-2222-222222220019', '4 BR+',    500.00, 120, 5),
  ('33333333-3333-3333-3333-333333330026', '22222222-2222-2222-2222-222222220019', 'Villa',    600.00, 150, 6)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- Bed Bug Treatment (PST-003) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330027', '22222222-2222-2222-2222-222222220021', 'Studio',   350.00,  60, 1),
  ('33333333-3333-3333-3333-333333330028', '22222222-2222-2222-2222-222222220021', '1 BR',     450.00,  90, 2),
  ('33333333-3333-3333-3333-333333330029', '22222222-2222-2222-2222-222222220021', '2 BR',     600.00, 120, 3),
  ('33333333-3333-3333-3333-333333330030', '22222222-2222-2222-2222-222222220021', '3 BR',     800.00, 150, 4),
  ('33333333-3333-3333-3333-333333330031', '22222222-2222-2222-2222-222222220021', '4 BR+',   1000.00, 180, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- Disinfection Service (PST-007) variants
INSERT INTO service_variants (id, service_id, variant_label, price_aed, duration_minutes, sort_order) VALUES
  ('33333333-3333-3333-3333-333333330032', '22222222-2222-2222-2222-222222220025', 'Studio',   300.00,  60, 1),
  ('33333333-3333-3333-3333-333333330033', '22222222-2222-2222-2222-222222220025', '1 BR',     400.00,  75, 2),
  ('33333333-3333-3333-3333-333333330034', '22222222-2222-2222-2222-222222220025', '2 BR',     500.00,  90, 3),
  ('33333333-3333-3333-3333-333333330035', '22222222-2222-2222-2222-222222220025', '3 BR',     650.00, 120, 4),
  ('33333333-3333-3333-3333-333333330036', '22222222-2222-2222-2222-222222220025', '4 BR+',    800.00, 150, 5)
ON CONFLICT (id) DO UPDATE SET
  variant_label = EXCLUDED.variant_label,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- 4. SERVICE ADD-ONS (30+)
-- =============================================================================
INSERT INTO service_addons (id, service_id, name_en, price_aed, duration_minutes, sort_order) VALUES
  -- Cleaning add-ons (for Regular/Deep Cleaning)
  ('44444444-4444-4444-4444-444444440001', '22222222-2222-2222-2222-222222220001', 'Oven Cleaning',                80.00,  30, 1),
  ('44444444-4444-4444-4444-444444440002', '22222222-2222-2222-2222-222222220001', 'Fridge Cleaning',              60.00,  20, 2),
  ('44444444-4444-4444-4444-444444440003', '22222222-2222-2222-2222-222222220001', 'Balcony Cleaning',             50.00,  20, 3),
  ('44444444-4444-4444-4444-444444440004', '22222222-2222-2222-2222-222222220001', 'Carpet Shampoo (per room)',    150.00,  30, 4),
  ('44444444-4444-4444-4444-444444440005', '22222222-2222-2222-2222-222222220001', 'Window Cleaning (interior)',    40.00,  15, 5),
  ('44444444-4444-4444-4444-444444440006', '22222222-2222-2222-2222-222222220001', 'Laundry & Ironing (per load)',  80.00,  45, 6),
  ('44444444-4444-4444-4444-444444440007', '22222222-2222-2222-2222-222222220001', 'Cabinet Interior Cleaning',     60.00,  30, 7),
  ('44444444-4444-4444-4444-444444440008', '22222222-2222-2222-2222-222222220001', 'Dishwasher Cleaning',           40.00,  15, 8),
  ('44444444-4444-4444-4444-444444440009', '22222222-2222-2222-2222-222222220001', 'Washing Machine Cleaning',      50.00,  20, 9),
  ('44444444-4444-4444-4444-444444440010', '22222222-2222-2222-2222-222222220001', 'Extra Bathroom',                60.00,  25, 10),

  -- Deep cleaning add-ons
  ('44444444-4444-4444-4444-444444440011', '22222222-2222-2222-2222-222222220002', 'Oven Deep Clean',             100.00,  40, 1),
  ('44444444-4444-4444-4444-444444440012', '22222222-2222-2222-2222-222222220002', 'Fridge Deep Clean',            80.00,  30, 2),
  ('44444444-4444-4444-4444-444444440013', '22222222-2222-2222-2222-222222220002', 'Balcony Deep Clean',           70.00,  30, 3),
  ('44444444-4444-4444-4444-444444440014', '22222222-2222-2222-2222-222222220002', 'Carpet Shampoo (per room)',   150.00,  30, 4),
  ('44444444-4444-4444-4444-444444440015', '22222222-2222-2222-2222-222222220002', 'Mattress Steam Clean',        100.00,  30, 5),
  ('44444444-4444-4444-4444-444444440016', '22222222-2222-2222-2222-222222220002', 'Window Cleaning (all)',         80.00,  40, 6),
  ('44444444-4444-4444-4444-444444440017', '22222222-2222-2222-2222-222222220002', 'Garage Cleaning',             120.00,  45, 7),

  -- AC add-ons
  ('44444444-4444-4444-4444-444444440018', '22222222-2222-2222-2222-222222220011', 'Additional AC Unit',           60.00,  30, 1),
  ('44444444-4444-4444-4444-444444440019', '22222222-2222-2222-2222-222222220011', 'Anti-Bacterial Treatment',      40.00,  15, 2),
  ('44444444-4444-4444-4444-444444440020', '22222222-2222-2222-2222-222222220011', 'Filter Replacement',           50.00,  10, 3),
  ('44444444-4444-4444-4444-444444440021', '22222222-2222-2222-2222-222222220012', 'Additional Unit Deep Clean',  120.00,  60, 1),
  ('44444444-4444-4444-4444-444444440022', '22222222-2222-2222-2222-222222220012', 'Duct Sanitizer Spray',         60.00,  15, 2),

  -- Pest control add-ons
  ('44444444-4444-4444-4444-444444440023', '22222222-2222-2222-2222-222222220019', 'Garden Treatment',            100.00,  30, 1),
  ('44444444-4444-4444-4444-444444440024', '22222222-2222-2222-2222-222222220019', 'Store Room Treatment',          50.00,  15, 2),
  ('44444444-4444-4444-4444-444444440025', '22222222-2222-2222-2222-222222220019', 'Parking Area Treatment',        80.00,  20, 3),

  -- Plumbing add-ons
  ('44444444-4444-4444-4444-444444440026', '22222222-2222-2222-2222-222222220027', 'Emergency After Hours',       150.00,   0, 1),
  ('44444444-4444-4444-4444-444444440027', '22222222-2222-2222-2222-222222220027', 'Parts Procurement',            50.00,  30, 2),

  -- Electrical add-ons
  ('44444444-4444-4444-4444-444444440028', '22222222-2222-2222-2222-222222220037', 'Emergency After Hours',       150.00,   0, 1),
  ('44444444-4444-4444-4444-444444440029', '22222222-2222-2222-2222-222222220037', 'Parts Procurement',            50.00,  30, 2),

  -- Painting add-ons
  ('44444444-4444-4444-4444-444444440030', '22222222-2222-2222-2222-222222220046', 'Premium Paint Upgrade',         8.00,   0, 1),
  ('44444444-4444-4444-4444-444444440031', '22222222-2222-2222-2222-222222220046', 'Furniture Moving & Cover',    100.00,  30, 2),
  ('44444444-4444-4444-4444-444444440032', '22222222-2222-2222-2222-222222220046', 'Wallpaper Removal',            10.00,   0, 3)
ON CONFLICT (id) DO UPDATE SET
  service_id = EXCLUDED.service_id,
  name_en = EXCLUDED.name_en,
  price_aed = EXCLUDED.price_aed,
  duration_minutes = EXCLUDED.duration_minutes,
  sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- 5. AREAS (12 P0 Launch Areas)
-- =============================================================================
INSERT INTO areas (id, slug, name_en, zone_group, description_en, latitude, longitude, property_types, priority, is_active, meta_title_en, meta_desc_en) VALUES
  ('55555555-5555-5555-5555-555555550001', 'dubai-marina', 'Dubai Marina', 'marina_coast',
   'Dubai Marina is a vibrant waterfront community with luxury high-rise apartments and stunning marina views. One of Dubai''s most sought-after residential areas, home to over 200 towers.',
   25.08000000, 55.14000000, ARRAY['apartment','penthouse'], 'p0_launch', true,
   'Home Services in Dubai Marina | PropertyCare',
   'Professional cleaning, AC, plumbing & maintenance services in Dubai Marina. Book online for same-day service.'),

  ('55555555-5555-5555-5555-555555550002', 'jbr', 'JBR (Jumeirah Beach Residence)', 'marina_coast',
   'Jumeirah Beach Residence is a beachfront community featuring 40 towers along a 1.7 km stretch of shoreline. The Walk and Ain Dubai make it a premier leisure destination.',
   25.07800000, 55.13300000, ARRAY['apartment','penthouse'], 'p0_launch', true,
   'Home Services in JBR | PropertyCare',
   'Expert home maintenance and cleaning services in Jumeirah Beach Residence. Fast booking, trusted professionals.'),

  ('55555555-5555-5555-5555-555555550003', 'palm-jumeirah', 'Palm Jumeirah', 'marina_coast',
   'The iconic Palm Jumeirah is a world-famous man-made island featuring luxury villas, apartments, and five-star resorts. A prestigious address synonymous with Dubai luxury living.',
   25.11200000, 55.13800000, ARRAY['villa','apartment','penthouse','townhouse'], 'p0_launch', true,
   'Home Services on Palm Jumeirah | PropertyCare',
   'Premium property maintenance for Palm Jumeirah villas and apartments. Trusted by hundreds of residents.'),

  ('55555555-5555-5555-5555-555555550004', 'downtown-dubai', 'Downtown Dubai', 'downtown',
   'Downtown Dubai is the city''s iconic centerpiece, home to the Burj Khalifa, Dubai Mall, and Dubai Opera. A thriving mixed-use district with world-class residential towers.',
   25.19700000, 55.27400000, ARRAY['apartment','penthouse'], 'p0_launch', true,
   'Home Services in Downtown Dubai | PropertyCare',
   'Professional property care services in Downtown Dubai. From Burj Khalifa residences to Boulevard apartments.'),

  ('55555555-5555-5555-5555-555555550005', 'business-bay', 'Business Bay', 'downtown',
   'Business Bay is a dynamic waterfront district along the Dubai Canal. With over 240 buildings, it blends commercial towers with premium residential properties.',
   25.18600000, 55.26200000, ARRAY['apartment','penthouse'], 'p0_launch', true,
   'Home Services in Business Bay | PropertyCare',
   'Reliable cleaning, AC and maintenance services for Business Bay apartments. Online booking available.'),

  ('55555555-5555-5555-5555-555555550006', 'difc', 'DIFC (Dubai International Financial Centre)', 'downtown',
   'DIFC is Dubai''s prestigious financial hub with upscale residences including the iconic Gate District. Premium living for professionals in the heart of the city.',
   25.21000000, 55.27800000, ARRAY['apartment','penthouse'], 'p0_launch', true,
   'Home Services in DIFC | PropertyCare',
   'Premium home maintenance services in DIFC. Expert technicians for luxury residences.'),

  ('55555555-5555-5555-5555-555555550007', 'jlt', 'JLT (Jumeirah Lakes Towers)', 'new_dubai',
   'Jumeirah Lakes Towers is a mixed-use development built around four artificial lakes. With 87 towers across 26 clusters, it offers affordable yet modern urban living.',
   25.07600000, 55.15000000, ARRAY['apartment'], 'p0_launch', true,
   'Home Services in JLT | PropertyCare',
   'Affordable professional home services in Jumeirah Lakes Towers. Cleaning, AC, plumbing and more.'),

  ('55555555-5555-5555-5555-555555550008', 'dubai-hills', 'Dubai Hills Estate', 'new_dubai',
   'Dubai Hills Estate is a master-planned community by Emaar and Meraas featuring villas, apartments, and a championship golf course. A green, family-oriented neighborhood.',
   25.14000000, 55.22000000, ARRAY['villa','apartment','townhouse'], 'p0_launch', true,
   'Home Services in Dubai Hills | PropertyCare',
   'Complete property care for Dubai Hills Estate villas and apartments. Book trusted professionals online.'),

  ('55555555-5555-5555-5555-555555550009', 'arabian-ranches', 'Arabian Ranches', 'villas',
   'Arabian Ranches is a premium gated villa community with lush landscapes, an 18-hole golf course, and a vibrant retail village. Ideal for families seeking suburban tranquility.',
   25.05600000, 55.26400000, ARRAY['villa','townhouse'], 'p0_launch', true,
   'Home Services in Arabian Ranches | PropertyCare',
   'Professional villa maintenance services in Arabian Ranches. Cleaning, pest control, AC and more.'),

  ('55555555-5555-5555-5555-555555550010', 'jumeirah', 'Jumeirah', 'villas',
   'Jumeirah is one of Dubai''s most established residential areas, stretching along the coast with a mix of traditional villas and modern townhouses. Known for its beaches and leafy streets.',
   25.22000000, 55.25000000, ARRAY['villa','townhouse'], 'p0_launch', true,
   'Home Services in Jumeirah | PropertyCare',
   'Trusted home services for Jumeirah villas and townhouses. Expert cleaning, maintenance and repairs.'),

  ('55555555-5555-5555-5555-555555550011', 'al-barsha', 'Al Barsha', 'villas',
   'Al Barsha is a centrally located residential area near Mall of the Emirates. It features a mix of villas, apartments, and townhouses with excellent connectivity.',
   25.11400000, 55.20000000, ARRAY['villa','apartment','townhouse'], 'p0_launch', true,
   'Home Services in Al Barsha | PropertyCare',
   'Quality home maintenance services in Al Barsha. From cleaning to AC repair, book online today.'),

  ('55555555-5555-5555-5555-555555550012', 'mirdif', 'Mirdif', 'villas',
   'Mirdif is a family-friendly residential area near Dubai International Airport. Known for its spacious villas and the popular Mirdif City Centre shopping mall.',
   25.22800000, 55.42000000, ARRAY['villa','townhouse'], 'p0_launch', true,
   'Home Services in Mirdif | PropertyCare',
   'Reliable property care services in Mirdif. Villa cleaning, AC service, plumbing and pest control.')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name_en = EXCLUDED.name_en,
  zone_group = EXCLUDED.zone_group,
  description_en = EXCLUDED.description_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  property_types = EXCLUDED.property_types,
  priority = EXCLUDED.priority,
  is_active = EXCLUDED.is_active,
  meta_title_en = EXCLUDED.meta_title_en,
  meta_desc_en = EXCLUDED.meta_desc_en;

-- =============================================================================
-- 6. AMC PLANS (4 tiers)
-- =============================================================================
INSERT INTO amc_plans (id, name_en, tier, description_en, included_services, response_time_hours, priority_level, discount_on_extras_pct, is_active) VALUES
  ('66666666-6666-6666-6666-666666660001', 'Essential', 'essential',
   'Basic annual maintenance covering AC servicing and general pest control. Ideal for apartments.',
   '[
     {"service_code": "AC-001", "visits_per_year": 2, "description": "AC general service (2x/year)"},
     {"service_code": "PST-001", "visits_per_year": 2, "description": "General pest control (2x/year)"}
   ]'::jsonb,
   24, 1, 5.00, true),

  ('66666666-6666-6666-6666-666666660002', 'Standard', 'standard',
   'Comprehensive maintenance package with quarterly AC service, pest control, and basic cleaning. Great value for families.',
   '[
     {"service_code": "AC-001", "visits_per_year": 4, "description": "AC general service (4x/year)"},
     {"service_code": "PST-001", "visits_per_year": 4, "description": "General pest control (4x/year)"},
     {"service_code": "CLN-002", "visits_per_year": 2, "description": "Deep cleaning (2x/year)"},
     {"service_code": "PLM-001", "visits_per_year": 2, "description": "Plumbing inspection (2x/year)"}
   ]'::jsonb,
   8, 2, 10.00, true),

  ('66666666-6666-6666-6666-666666660003', 'Premium', 'premium',
   'Full-service property care with priority response, monthly cleaning, and comprehensive maintenance coverage.',
   '[
     {"service_code": "AC-001", "visits_per_year": 4, "description": "AC general service (4x/year)"},
     {"service_code": "AC-002", "visits_per_year": 2, "description": "AC deep cleaning (2x/year)"},
     {"service_code": "PST-001", "visits_per_year": 4, "description": "General pest control (4x/year)"},
     {"service_code": "CLN-002", "visits_per_year": 4, "description": "Deep cleaning (4x/year)"},
     {"service_code": "PLM-001", "visits_per_year": 4, "description": "Plumbing inspection (4x/year)"},
     {"service_code": "ELC-001", "visits_per_year": 2, "description": "Electrical inspection (2x/year)"}
   ]'::jsonb,
   4, 3, 15.00, true),

  ('66666666-6666-6666-6666-666666660004', 'VIP', 'vip',
   'The ultimate property care experience with emergency response, unlimited inspections, and concierge-level service for premium properties.',
   '[
     {"service_code": "AC-001", "visits_per_year": 6, "description": "AC general service (6x/year)"},
     {"service_code": "AC-002", "visits_per_year": 4, "description": "AC deep cleaning (4x/year)"},
     {"service_code": "PST-001", "visits_per_year": 6, "description": "General pest control (6x/year)"},
     {"service_code": "CLN-002", "visits_per_year": 6, "description": "Deep cleaning (6x/year)"},
     {"service_code": "PLM-001", "visits_per_year": 6, "description": "Plumbing inspection (6x/year)"},
     {"service_code": "ELC-001", "visits_per_year": 4, "description": "Electrical inspection (4x/year)"},
     {"service_code": "PST-007", "visits_per_year": 2, "description": "Disinfection service (2x/year)"}
   ]'::jsonb,
   2, 4, 20.00, true)
ON CONFLICT (tier) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  description_en = EXCLUDED.description_en,
  included_services = EXCLUDED.included_services,
  response_time_hours = EXCLUDED.response_time_hours,
  priority_level = EXCLUDED.priority_level,
  discount_on_extras_pct = EXCLUDED.discount_on_extras_pct,
  is_active = EXCLUDED.is_active;

-- =============================================================================
-- 7. AMC PLAN PRICING (4 plans x 9 unit types = 36 rows)
-- =============================================================================
INSERT INTO amc_plan_pricing (id, plan_id, unit_type, annual_price_aed, monthly_price_aed, quarterly_price_aed) VALUES
  -- Essential: studio to villa_large
  ('77777777-7777-7777-7777-777777770001', '66666666-6666-6666-6666-666666660001', 'studio',       1499.00,  149.00,  399.00),
  ('77777777-7777-7777-7777-777777770002', '66666666-6666-6666-6666-666666660001', '1br',          1799.00,  179.00,  479.00),
  ('77777777-7777-7777-7777-777777770003', '66666666-6666-6666-6666-666666660001', '2br',          2099.00,  209.00,  559.00),
  ('77777777-7777-7777-7777-777777770004', '66666666-6666-6666-6666-666666660001', '3br',          2499.00,  249.00,  669.00),
  ('77777777-7777-7777-7777-777777770005', '66666666-6666-6666-6666-666666660001', '4br',          2899.00,  289.00,  779.00),
  ('77777777-7777-7777-7777-777777770006', '66666666-6666-6666-6666-666666660001', '5br_plus',     3299.00,  329.00,  879.00),
  ('77777777-7777-7777-7777-777777770007', '66666666-6666-6666-6666-666666660001', 'villa_small',  3699.00,  369.00,  989.00),
  ('77777777-7777-7777-7777-777777770008', '66666666-6666-6666-6666-666666660001', 'villa_medium', 4299.00,  429.00, 1149.00),
  ('77777777-7777-7777-7777-777777770009', '66666666-6666-6666-6666-666666660001', 'villa_large',  4999.00,  499.00, 1339.00),

  -- Standard
  ('77777777-7777-7777-7777-777777770010', '66666666-6666-6666-6666-666666660002', 'studio',       2999.00,  299.00,  799.00),
  ('77777777-7777-7777-7777-777777770011', '66666666-6666-6666-6666-666666660002', '1br',          3499.00,  349.00,  939.00),
  ('77777777-7777-7777-7777-777777770012', '66666666-6666-6666-6666-666666660002', '2br',          3999.00,  399.00, 1069.00),
  ('77777777-7777-7777-7777-777777770013', '66666666-6666-6666-6666-666666660002', '3br',          4799.00,  479.00, 1279.00),
  ('77777777-7777-7777-7777-777777770014', '66666666-6666-6666-6666-666666660002', '4br',          5499.00,  549.00, 1469.00),
  ('77777777-7777-7777-7777-777777770015', '66666666-6666-6666-6666-666666660002', '5br_plus',     6299.00,  629.00, 1679.00),
  ('77777777-7777-7777-7777-777777770016', '66666666-6666-6666-6666-666666660002', 'villa_small',  6999.00,  699.00, 1869.00),
  ('77777777-7777-7777-7777-777777770017', '66666666-6666-6666-6666-666666660002', 'villa_medium', 7999.00,  799.00, 2139.00),
  ('77777777-7777-7777-7777-777777770018', '66666666-6666-6666-6666-666666660002', 'villa_large',  8999.00,  899.00, 2399.00),

  -- Premium
  ('77777777-7777-7777-7777-777777770019', '66666666-6666-6666-6666-666666660003', 'studio',       4999.00,  499.00, 1339.00),
  ('77777777-7777-7777-7777-777777770020', '66666666-6666-6666-6666-666666660003', '1br',          5799.00,  579.00, 1549.00),
  ('77777777-7777-7777-7777-777777770021', '66666666-6666-6666-6666-666666660003', '2br',          6799.00,  679.00, 1819.00),
  ('77777777-7777-7777-7777-777777770022', '66666666-6666-6666-6666-666666660003', '3br',          7999.00,  799.00, 2139.00),
  ('77777777-7777-7777-7777-777777770023', '66666666-6666-6666-6666-666666660003', '4br',          9299.00,  929.00, 2489.00),
  ('77777777-7777-7777-7777-777777770024', '66666666-6666-6666-6666-666666660003', '5br_plus',    10499.00, 1049.00, 2809.00),
  ('77777777-7777-7777-7777-777777770025', '66666666-6666-6666-6666-666666660003', 'villa_small', 11999.00, 1199.00, 3199.00),
  ('77777777-7777-7777-7777-777777770026', '66666666-6666-6666-6666-666666660003', 'villa_medium',13999.00, 1399.00, 3739.00),
  ('77777777-7777-7777-7777-777777770027', '66666666-6666-6666-6666-666666660003', 'villa_large', 15999.00, 1599.00, 4279.00),

  -- VIP
  ('77777777-7777-7777-7777-777777770028', '66666666-6666-6666-6666-666666660004', 'studio',       7999.00,  799.00, 2139.00),
  ('77777777-7777-7777-7777-777777770029', '66666666-6666-6666-6666-666666660004', '1br',          9499.00,  949.00, 2539.00),
  ('77777777-7777-7777-7777-777777770030', '66666666-6666-6666-6666-666666660004', '2br',         10999.00, 1099.00, 2939.00),
  ('77777777-7777-7777-7777-777777770031', '66666666-6666-6666-6666-666666660004', '3br',         12999.00, 1299.00, 3479.00),
  ('77777777-7777-7777-7777-777777770032', '66666666-6666-6666-6666-666666660004', '4br',         14999.00, 1499.00, 3999.00),
  ('77777777-7777-7777-7777-777777770033', '66666666-6666-6666-6666-666666660004', '5br_plus',    17499.00, 1749.00, 4679.00),
  ('77777777-7777-7777-7777-777777770034', '66666666-6666-6666-6666-666666660004', 'villa_small', 19999.00, 1999.00, 5339.00),
  ('77777777-7777-7777-7777-777777770035', '66666666-6666-6666-6666-666666660004', 'villa_medium',23999.00, 2399.00, 6399.00),
  ('77777777-7777-7777-7777-777777770036', '66666666-6666-6666-6666-666666660004', 'villa_large', 29999.00, 2999.00, 7999.00)
ON CONFLICT (plan_id, unit_type) DO UPDATE SET
  annual_price_aed = EXCLUDED.annual_price_aed,
  monthly_price_aed = EXCLUDED.monthly_price_aed,
  quarterly_price_aed = EXCLUDED.quarterly_price_aed;

-- =============================================================================
-- 8. PROMOTIONS (5)
-- =============================================================================
INSERT INTO promotions (id, code, name, description_en, discount_type, discount_value, min_order_aed, max_discount_aed, is_first_order_only, is_public, is_active, valid_from, valid_until, usage_limit_total, usage_limit_per_user, applicable_areas) VALUES
  ('88888888-8888-8888-8888-888888880001', 'WELCOME20', 'Welcome 20% Off',
   '20% off your first order with PropertyCare. Maximum discount 200 AED.',
   'percentage', 20.00, 0, 200.00, true, true, true,
   '2026-01-01'::timestamptz, '2027-12-31'::timestamptz, NULL, 1, '{}'),

  ('88888888-8888-8888-8888-888888880002', 'SUMMER2026', 'Summer 2026 Promotion',
   '15% off all services during summer. Maximum discount 150 AED.',
   'percentage', 15.00, 0, 150.00, false, true, true,
   '2026-06-01'::timestamptz, '2026-08-31'::timestamptz, NULL, 2, '{}'),

  ('88888888-8888-8888-8888-888888880003', 'MARINA10', 'Marina Area Discount',
   '50 AED off for Dubai Marina residents. Minimum order 300 AED.',
   'fixed_amount', 50.00, 300.00, NULL, false, true, true,
   '2026-01-01'::timestamptz, '2026-12-31'::timestamptz, 500, 3,
   ARRAY['55555555-5555-5555-5555-555555550001']::uuid[]),

  ('88888888-8888-8888-8888-888888880004', 'FIRSTORDER', 'Free Balcony Cleaning',
   'Get a free balcony cleaning add-on with your first order.',
   'free_addon', 0.00, 0, NULL, true, true, true,
   '2026-01-01'::timestamptz, '2027-12-31'::timestamptz, NULL, 1, '{}'),

  ('88888888-8888-8888-8888-888888880005', 'REFER50', 'Referral Reward',
   'Get 50 AED off when referred by a friend.',
   'fixed_amount', 50.00, 0, NULL, false, false, true,
   '2026-01-01'::timestamptz, '2027-12-31'::timestamptz, NULL, 1, '{}')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description_en = EXCLUDED.description_en,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_order_aed = EXCLUDED.min_order_aed,
  max_discount_aed = EXCLUDED.max_discount_aed,
  is_first_order_only = EXCLUDED.is_first_order_only,
  is_public = EXCLUDED.is_public,
  is_active = EXCLUDED.is_active,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  usage_limit_total = EXCLUDED.usage_limit_total,
  usage_limit_per_user = EXCLUDED.usage_limit_per_user,
  applicable_areas = EXCLUDED.applicable_areas;

-- Update FIRSTORDER to reference the balcony cleaning add-on
UPDATE promotions
SET free_addon_id = '44444444-4444-4444-4444-444444440003'
WHERE code = 'FIRSTORDER';

COMMIT;
