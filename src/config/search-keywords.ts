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
    'big clean', 'one time cleaning',
    'general cleaning', 'top to bottom cleaning', 'whole apartment clean',
  ],
  'move-in-out-cleaning': [
    'move in cleaning', 'move out cleaning', 'end of lease cleaning',
    'handover cleaning', 'pre move cleaning', 'post move cleaning',
    'tenancy cleaning', 'moving cleaning', 'new apartment cleaning',
    'checkout cleaning', 'vacating cleaning', 'snagging clean',
    'move out clean', 'end of tenancy',
  ],
  'sofa-cleaning': [
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
  'water-tank-cleaning': [
    'tank cleaning', 'water tank', 'tank sanitize', 'water storage clean',
    'overhead tank', 'water tank wash', 'tank disinfection',
  ],
  'post-construction-cleaning': [
    'post construction', 'after renovation', 'construction cleanup',
    'post renovation cleaning', 'builder clean', 'construction dust',
  ],
  'kitchen-deep-cleaning': [
    'kitchen deep clean', 'oven cleaning', 'hood cleaning',
    'kitchen scrub', 'stove cleaning', 'kitchen grease',
  ],
  'bathroom-deep-cleaning': [
    'bathroom deep clean', 'grout cleaning', 'tile cleaning',
    'bathroom scrub', 'mold cleaning', 'bathroom sanitize',
  ],
  'curtain-cleaning': [
    'curtain clean', 'drape cleaning', 'blind cleaning',
    'curtain wash', 'curtain steam', 'window covering clean',
  ],
  'disinfection-service': [
    'disinfect', 'sanitize', 'sterilize', 'covid cleaning',
    'disinfection', 'sanitization', 'antibacterial cleaning',
  ],

  // AC services
  'ac-general-service': [
    'ac cleaning', 'ac service', 'ac maintenance', 'air conditioner service',
    'ac filter', 'ac checkup', 'split ac', 'ac tune up', 'aircon service',
    'air conditioning maintenance', 'ac wash', 'cooling service', 'hvac',
    'ac not cooling', 'ac smell', 'ac noise',
  ],
  'ac-deep-cleaning': [
    'ac deep clean', 'ac chemical wash', 'ac chemical clean', 'coil cleaning',
    'ac thorough clean', 'ac full service', 'ac overhaul', 'ac sanitize',
  ],
  'ac-duct-cleaning': [
    'duct cleaning', 'ac duct', 'air duct', 'vent cleaning', 'ductwork',
    'duct sanitize', 'air vent clean', 'central ac clean', 'duct mold',
  ],
  'ac-repair': [
    'ac repair', 'ac fix', 'ac not working', 'ac broken', 'ac leak',
    'ac dripping', 'compressor repair',
    'ac emergency', 'ac problem', 'ac issue', 'ac malfunction',
  ],
  'ac-installation': [
    'ac install', 'ac installation', 'new ac', 'ac setup', 'split ac install',
    'ac unit install', 'air conditioner install', 'ac fitting', 'ac mount',
  ],
  'ac-gas-refill': [
    'ac gas', 'freon', 'refrigerant refill', 'gas top up',
    'ac gas refill', 'refrigerant', 'ac recharge', 'gas charge',
  ],
  'ac-thermostat-install': [
    'thermostat install', 'ac thermostat', 'smart thermostat',
    'temperature control', 'thermostat replacement',
  ],
  'ac-amc': [
    'ac annual contract', 'ac yearly service', 'ac care plan',
    'ac maintenance contract', 'ac subscription', 'ac plan',
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
  'cockroach-treatment': [
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
  'mosquito-control': [
    'mosquito', 'mosquito spray', 'mosquito fogging',
    'mosquito repellent', 'mosquito treatment', 'mosquito net',
  ],
  'snake-scorpion-control': [
    'snake', 'scorpion', 'reptile control',
    'snake removal', 'scorpion removal', 'snake catcher',
  ],

  // Plumbing
  'plumbing-repair': [
    'plumber', 'plumbing', 'leak repair', 'pipe repair', 'tap repair',
    'faucet repair', 'sink repair',
    'water leak', 'pipe leak', 'dripping tap', 'plumbing service',
    'bathroom plumbing', 'pipe fitting',
  ],
  'drain-unblocking': [
    'emergency plumber', 'urgent plumbing', 'burst pipe', 'flooding',
    'water damage', 'pipe burst', 'sewage backup', 'toilet overflow',
    'emergency leak', 'plumbing emergency', 'water everywhere',
    'drain blocked', 'drain clog', 'blocked drain', 'drain cleaning',
  ],
  'water-heater-installation': [
    'water heater', 'geyser', 'hot water', 'water heater install',
    'boiler', 'no hot water', 'heater replacement',
    'water heater setup', 'geyser install',
  ],
  'water-heater-repair': [
    'appliance repair', 'washing machine repair', 'dryer repair',
    'dishwasher repair', 'oven repair', 'fridge repair', 'freezer repair',
    'appliance fix', 'appliance not working', 'machine repair',
    'water heater repair', 'water heater fix', 'geyser repair',
  ],
  'toilet-repair': [
    'toilet fix', 'toilet leak', 'flush repair', 'toilet running',
    'toilet repair', 'cistern repair', 'toilet problem',
  ],
  'kitchen-plumbing': [
    'kitchen plumbing', 'kitchen sink', 'kitchen drain',
    'kitchen tap repair', 'garbage disposal', 'kitchen pipe',
  ],
  'tap-mixer-install': [
    'tap install', 'faucet install', 'mixer tap', 'kitchen tap',
    'tap replacement', 'faucet replacement', 'basin tap',
  ],
  'water-pump-repair': [
    'water pump', 'pump repair', 'booster pump',
    'pump not working', 'water pressure', 'pump motor',
  ],

  // Handyman & Mounting
  'tv-mounting': [
    'handyman', 'odd jobs', 'fix things', 'small repairs', 'general repair',
    'home repair', 'maintenance man', 'fixer', 'handy man', 'mr fix it',
    'furniture assembly', 'shelf mounting', 'curtain hanging', 'tv mounting',
    'picture hanging', 'door repair', 'handle repair', 'ikea assembly',
    'tv mount', 'tv wall mount', 'tv bracket', 'tv hanging',
  ],

  // Electrical
  'electrical-repair': [
    'electrician', 'electrical', 'wiring', 'socket repair', 'switch repair',
    'light fixture', 'electrical repair', 'power outlet',
    'fan install', 'dimmer switch',
    'electrical fault', 'short circuit',
  ],
  'circuit-breaker-repair': [
    'emergency electrician', 'power out', 'no electricity', 'sparking wire',
    'electrical fire risk', 'urgent electrical', 'power failure',
    'circuit breaker', 'tripping breaker', 'breaker trip', 'mcb repair',
  ],
  'light-installation': [
    'light install', 'chandelier', 'ceiling light', 'lamp install',
    'light fixture install', 'led install', 'spotlight install',
  ],
  'smart-home-setup': [
    'smart home', 'smart lock', 'ring doorbell', 'alexa setup', 'google home',
    'smart light', 'home automation', 'wifi thermostat', 'smart switch',
    'iot setup', 'connected home',
  ],
  'cctv-installation': [
    'cctv', 'security camera', 'surveillance', 'camera install',
    'home security', 'cctv setup', 'security system',
    'ip camera', 'night vision camera',
  ],
  'doorbell-intercom': [
    'doorbell install', 'intercom', 'video doorbell',
    'doorbell replacement', 'door intercom', 'smart doorbell',
  ],
  'ev-charger-installation': [
    'ev charger', 'electric car charger', 'tesla charger',
    'ev charging station', 'electric vehicle charger', 'home charger',
  ],
  'full-rewiring': [
    'rewire', 'full electrical', 'house wiring',
    'electrical rewire', 'complete rewiring', 'old wiring',
  ],

  // Painting & Walls
  'interior-painting': [
    'painting', 'paint apartment', 'wall painting', 'house painting',
    'interior painting', 'room painting', 'repaint', 'paint job',
    'wall color', 'fresh paint', 'apartment painting',
    'paint my house', 'painter', 'painting contractor',
  ],
  'villa-exterior-painting': [
    'villa paint', 'exterior paint', 'outside painting',
    'villa painting', 'exterior house paint', 'outdoor painting',
  ],
  'wallpaper-installation': [
    'wallpaper', 'wall paper', 'wallpaper install', 'wallpaper removal',
    'wallpaper hanging', 'wall covering',
  ],
  'accent-wall': [
    'accent wall', 'feature wall', 'statement wall',
    'decorative wall', 'wall design', 'wall panel',
  ],
  'wood-varnishing': [
    'varnish', 'wood polish', 'wood finish', 'lacquer',
    'wood stain', 'wood coating', 'furniture varnish',
  ],

  // Renovation & Flooring
  'bathroom-renovation': [
    'bathroom renovation', 'bathroom remodel', 'bathroom upgrade',
    'shower install', 'bathtub', 'bathroom tile', 'bathroom design',
    'new bathroom', 'bathroom makeover', 'bathroom fitting',
    'kitchen renovation', 'kitchen remodel', 'kitchen upgrade',
    'kitchen cabinet', 'kitchen countertop', 'kitchen design',
    'new kitchen', 'kitchen makeover', 'kitchen fitting',
  ],
  'flooring-installation': [
    'flooring', 'floor install', 'tile install', 'wood floor', 'vinyl floor',
    'laminate', 'marble floor', 'parquet', 'floor replacement', 'new floor',
    'floor tile', 'ceramic tile',
  ],
  'false-ceiling': [
    'false ceiling', 'gypsum ceiling', 'drop ceiling',
    'suspended ceiling', 'ceiling design', 'ceiling panel',
  ],
  'partition-wall': [
    'partition', 'room divider', 'glass partition', 'office partition',
    'partition wall', 'drywall partition', 'gypsum partition',
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
