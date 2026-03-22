// Maps alternative search terms to service slugs
// When a user searches "maid", they should see "Regular Home Cleaning"
export const searchKeywords: Record<string, string[]> = {
  // Cleaning services
  'regular-home-cleaning': [
    'maid', 'maid service', 'house maid', 'cleaning lady', 'housekeeper',
    'home cleaning', 'house cleaning', 'apartment cleaning', 'flat cleaning',
    'weekly cleaning', 'regular cleaning', 'routine cleaning', 'basic cleaning',
    'tidying up', 'housekeeping', 'domestic help', 'cleaning service',
    'studio cleaning', 'room cleaning', 'office cleaning',
  ],
  'deep-cleaning': [
    'deep clean', 'spring cleaning', 'thorough cleaning', 'intensive cleaning',
    'full cleaning', 'heavy cleaning', 'detailed cleaning', 'complete cleaning',
    'move out clean', 'end of tenancy', 'big clean', 'one time cleaning',
    'general cleaning', 'top to bottom cleaning', 'whole apartment clean',
  ],
  'move-in-out-cleaning': [
    'move in cleaning', 'move out cleaning', 'end of lease cleaning',
    'handover cleaning', 'pre move cleaning', 'post move cleaning',
    'tenancy cleaning', 'moving cleaning', 'new apartment cleaning',
    'checkout cleaning', 'vacating cleaning', 'snagging clean',
  ],
  'sofa-upholstery-cleaning': [
    'sofa cleaning', 'couch cleaning', 'upholstery cleaning', 'sofa shampoo',
    'couch shampoo', 'fabric cleaning', 'sofa steam clean', 'chair cleaning',
    'furniture cleaning', 'cushion cleaning', 'ottoman cleaning',
  ],
  'carpet-cleaning': [
    'carpet clean', 'carpet shampoo', 'carpet steam', 'rug cleaning',
    'carpet stain removal', 'carpet wash', 'floor carpet', 'rug shampoo',
    'carpet deep clean', 'mat cleaning',
  ],
  'mattress-cleaning': [
    'mattress clean', 'bed cleaning', 'mattress sanitize', 'mattress steam',
    'bed bug mattress', 'mattress shampoo', 'bed hygiene', 'mattress wash',
  ],
  'window-cleaning': [
    'window wash', 'glass cleaning', 'window cleaner', 'window wipe',
    'glass polish', 'window shine', 'balcony glass', 'sliding door clean',
  ],
  'water-tank-cleaning': [
    'tank cleaning', 'water tank', 'tank sanitize', 'water storage clean',
    'overhead tank', 'water tank wash', 'tank disinfection',
  ],

  // AC services
  'ac-service': [
    'ac cleaning', 'ac service', 'ac maintenance', 'air conditioner service',
    'ac filter', 'ac checkup', 'split ac', 'ac tune up', 'aircon service',
    'air conditioning maintenance', 'ac wash', 'cooling service', 'hvac',
    'ac not cooling', 'ac smell', 'ac noise',
  ],
  'ac-deep-clean': [
    'ac deep clean', 'ac chemical wash', 'ac chemical clean', 'coil cleaning',
    'ac thorough clean', 'ac full service', 'ac overhaul', 'ac sanitize',
  ],
  'ac-duct-cleaning': [
    'duct cleaning', 'ac duct', 'air duct', 'vent cleaning', 'ductwork',
    'duct sanitize', 'air vent clean', 'central ac clean', 'duct mold',
  ],
  'ac-repair': [
    'ac repair', 'ac fix', 'ac not working', 'ac broken', 'ac leak',
    'ac dripping', 'ac gas refill', 'refrigerant', 'compressor repair',
    'ac emergency', 'ac problem', 'ac issue', 'ac malfunction',
  ],
  'ac-installation': [
    'ac install', 'ac installation', 'new ac', 'ac setup', 'split ac install',
    'ac unit install', 'air conditioner install', 'ac fitting', 'ac mount',
  ],

  // Pest control
  'general-pest-control': [
    'pest control', 'bug spray', 'insect spray', 'pest treatment',
    'pest exterminator', 'bug killer', 'insect control', 'pest prevention',
    'pest service', 'fumigation', 'spraying', 'insect problem',
    'bugs in house', 'creepy crawlies', 'insect infestation',
  ],
  'bed-bug-treatment': [
    'bed bugs', 'bedbug', 'bed bug spray', 'bed bug treatment',
    'bed bug exterminator', 'mattress bugs', 'biting in bed', 'bed insect',
    'bed bug removal', 'bed bug fumigation',
  ],
  'cockroach-gel-treatment': [
    'cockroach', 'roach', 'cockroach gel', 'roach killer', 'cockroach spray',
    'cockroach bait', 'kitchen roach', 'roach problem', 'roach infestation',
    'german cockroach', 'american cockroach',
  ],
  'termite-treatment': [
    'termite', 'termite control', 'white ant', 'wood pest', 'termite spray',
    'termite inspection', 'termite damage', 'wood damage', 'termite prevention',
  ],
  'rodent-control': [
    'rat', 'mouse', 'rodent', 'rat control', 'mouse trap', 'rat poison',
    'rodent removal', 'mice', 'rat problem', 'rat infestation',
  ],

  // Plumbing
  'plumbing-standard': [
    'plumber', 'plumbing', 'leak repair', 'pipe repair', 'tap repair',
    'faucet repair', 'drain blocked', 'toilet repair', 'sink repair',
    'water leak', 'pipe leak', 'dripping tap', 'plumbing service',
    'bathroom plumbing', 'kitchen plumbing', 'pipe fitting',
  ],
  'plumbing-emergency': [
    'emergency plumber', 'urgent plumbing', 'burst pipe', 'flooding',
    'water damage', 'pipe burst', 'sewage backup', 'toilet overflow',
    'emergency leak', 'plumbing emergency', 'water everywhere',
  ],
  'water-heater-install': [
    'water heater', 'geyser', 'hot water', 'water heater install',
    'boiler', 'water heater repair', 'no hot water', 'heater replacement',
  ],
  'handyman-general': [
    'handyman', 'odd jobs', 'fix things', 'small repairs', 'general repair',
    'home repair', 'maintenance man', 'fixer', 'handy man', 'mr fix it',
    'furniture assembly', 'shelf mounting', 'curtain hanging', 'tv mounting',
    'picture hanging', 'door repair', 'handle repair', 'ikea assembly',
  ],

  // Electrical
  'electrical-standard': [
    'electrician', 'electrical', 'wiring', 'socket repair', 'switch repair',
    'light fixture', 'electrical repair', 'power outlet', 'circuit breaker',
    'fan install', 'light install', 'chandelier', 'dimmer switch',
    'electrical fault', 'short circuit', 'tripping breaker',
  ],
  'electrical-emergency': [
    'emergency electrician', 'power out', 'no electricity', 'sparking wire',
    'electrical fire risk', 'urgent electrical', 'power failure',
  ],
  'smart-home-setup': [
    'smart home', 'smart lock', 'ring doorbell', 'alexa setup', 'google home',
    'smart light', 'home automation', 'wifi thermostat', 'smart switch',
    'iot setup', 'connected home',
  ],
  'cctv-installation': [
    'cctv', 'security camera', 'surveillance', 'camera install',
    'home security', 'cctv setup', 'video doorbell', 'security system',
    'ip camera', 'night vision camera',
  ],
  'appliance-repair': [
    'appliance repair', 'washing machine repair', 'dryer repair',
    'dishwasher repair', 'oven repair', 'fridge repair', 'freezer repair',
    'appliance fix', 'appliance not working', 'machine repair',
  ],

  // Painting
  'painting-studio': [
    'painting', 'paint apartment', 'wall painting', 'house painting',
    'interior painting', 'room painting', 'repaint', 'paint job',
    'wall color', 'fresh paint', 'apartment painting', 'villa painting',
    'paint my house', 'painter', 'painting contractor',
  ],
  'wallpaper-install': [
    'wallpaper', 'wall paper', 'wallpaper install', 'wallpaper removal',
    'accent wall', 'feature wall', 'wallpaper hanging', 'wall covering',
  ],
  'kitchen-renovation': [
    'kitchen renovation', 'kitchen remodel', 'kitchen upgrade',
    'kitchen cabinet', 'kitchen countertop', 'kitchen design',
    'new kitchen', 'kitchen makeover', 'kitchen fitting',
  ],
  'bathroom-renovation': [
    'bathroom renovation', 'bathroom remodel', 'bathroom upgrade',
    'shower install', 'bathtub', 'bathroom tile', 'bathroom design',
    'new bathroom', 'bathroom makeover', 'bathroom fitting',
  ],
  'flooring-install': [
    'flooring', 'floor install', 'tile install', 'wood floor', 'vinyl floor',
    'laminate', 'marble floor', 'parquet', 'floor replacement', 'new floor',
    'floor tile', 'ceramic tile',
  ],
};

// Reverse index: keyword -> service slugs (built once at import time)
const reverseIndex = new Map<string, string[]>();
for (const [serviceSlug, keywords] of Object.entries(searchKeywords)) {
  for (const keyword of keywords) {
    const lower = keyword.toLowerCase();
    const existing = reverseIndex.get(lower) ?? [];
    existing.push(serviceSlug);
    reverseIndex.set(lower, existing);
  }
}

export function searchServices(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const matches = new Set<string>();

  // Exact keyword match
  const exact = reverseIndex.get(q);
  if (exact) exact.forEach(slug => matches.add(slug));

  // Partial match -- check if query is contained in any keyword
  for (const [keyword, slugs] of reverseIndex.entries()) {
    if (keyword.includes(q) || q.includes(keyword)) {
      slugs.forEach(slug => matches.add(slug));
    }
  }

  // Also match against service slug directly
  for (const slug of Object.keys(searchKeywords)) {
    if (slug.includes(q.replace(/\s+/g, '-'))) {
      matches.add(slug);
    }
  }

  return Array.from(matches);
}
