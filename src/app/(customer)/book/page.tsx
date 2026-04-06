'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/features/customer/hooks/useBooking';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Calendar, CreditCard, Zap } from 'lucide-react';

// Step indicators
function StepProgress({ current }: { current: number }) {
  const steps = ['Service', 'Size', 'Add-ons', 'Location', 'Schedule', 'Account', 'Review', 'Done'];
  return (
    <>
      {/* Desktop: show all steps */}
      <div className="mb-8 hidden overflow-x-auto pb-2 md:flex">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              i + 1 < current ? 'bg-green-500 text-white' :
              i + 1 === current ? 'bg-accent text-accent-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {i + 1 < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-2 whitespace-nowrap text-sm ${
              i + 1 === current ? 'font-medium text-foreground' : 'text-muted-foreground'
            }`}>{step}</span>
            {i < 7 && <div className="mx-3 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>
      {/* Mobile: show current step with counter */}
      <div className="mb-8 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {current}
          </div>
          <span className="text-sm font-medium text-foreground">
            {steps[current - 1] ?? ''}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Step {current} of {steps.length}
        </span>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-muted">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(current / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

// Static fallback data used when Supabase returns empty or fails
const fallbackCategories = [
  { id: 'cat-cleaning', slug: 'cleaning', name_en: 'Cleaning', description_en: 'Professional cleaning services for apartments and villas' },
  { id: 'cat-ac', slug: 'ac-services', name_en: 'AC Services', description_en: 'AC servicing, deep cleaning, duct sanitization, and repairs' },
  { id: 'cat-pest', slug: 'pest-control', name_en: 'Pest Control', description_en: 'Municipality-approved treatments for all common pests' },
  { id: 'cat-plumbing', slug: 'plumbing', name_en: 'Plumbing', description_en: 'Leak repair, drain unblocking, water heater, and emergency plumbing' },
  { id: 'cat-electrical', slug: 'electrical', name_en: 'Electrical', description_en: 'Socket repair, wiring, smart home setup, and CCTV installation' },
  { id: 'cat-painting', slug: 'painting', name_en: 'Painting & Fit-Out', description_en: 'Interior painting, wallpaper, bathroom renovation, and flooring' },
];

const fallbackServices = [
  { id: 'svc-regular-cleaning', slug: 'regular-home-cleaning', name_en: 'Regular Cleaning', short_desc_en: 'Professional maid service', base_price_aed: 38, category_id: 'cat-cleaning' },
  { id: 'svc-deep-cleaning', slug: 'deep-cleaning', name_en: 'Deep Cleaning', short_desc_en: 'Top-to-bottom thorough cleaning', base_price_aed: 250, category_id: 'cat-cleaning' },
  { id: 'svc-move-in-out', slug: 'move-in-out-cleaning', name_en: 'Move-In/Out Cleaning', short_desc_en: 'End of tenancy cleaning', base_price_aed: 400, category_id: 'cat-cleaning' },
  { id: 'svc-sofa', slug: 'sofa-cleaning', name_en: 'Sofa Cleaning', short_desc_en: 'Steam & shampoo upholstery', base_price_aed: 150, category_id: 'cat-cleaning' },
  { id: 'svc-carpet', slug: 'carpet-cleaning', name_en: 'Carpet Cleaning', short_desc_en: 'Deep carpet shampooing', base_price_aed: 100, category_id: 'cat-cleaning' },
  { id: 'svc-mattress', slug: 'mattress-cleaning', name_en: 'Mattress Cleaning', short_desc_en: 'Sanitize & deep clean', base_price_aed: 100, category_id: 'cat-cleaning' },
  { id: 'svc-ac-service', slug: 'ac-general-service', name_en: 'AC Service', short_desc_en: 'Standard AC maintenance', base_price_aed: 120, category_id: 'cat-ac' },
  { id: 'svc-ac-deep', slug: 'ac-deep-cleaning', name_en: 'AC Deep Clean', short_desc_en: 'Coil & fin deep cleaning', base_price_aed: 200, category_id: 'cat-ac' },
  { id: 'svc-ac-duct', slug: 'ac-duct-cleaning', name_en: 'Duct Cleaning', short_desc_en: 'Full duct sanitization', base_price_aed: 350, category_id: 'cat-ac' },
  { id: 'svc-ac-repair', slug: 'ac-repair', name_en: 'AC Repair', short_desc_en: 'Diagnose & fix AC issues', base_price_aed: 200, category_id: 'cat-ac' },
  { id: 'svc-ac-install', slug: 'ac-installation', name_en: 'AC Installation', short_desc_en: 'New unit installation', base_price_aed: 500, category_id: 'cat-ac' },
  { id: 'svc-pest-general', slug: 'general-pest-control', name_en: 'General Pest Control', short_desc_en: 'All-round pest treatment', base_price_aed: 220, category_id: 'cat-pest' },
  { id: 'svc-pest-bedbugs', slug: 'bed-bug-treatment', name_en: 'Bed Bug Treatment', short_desc_en: 'Targeted bed bug elimination', base_price_aed: 350, category_id: 'cat-pest' },
  { id: 'svc-pest-cockroach', slug: 'cockroach-treatment', name_en: 'Cockroach Gel Treatment', short_desc_en: 'Long-lasting cockroach gel', base_price_aed: 250, category_id: 'cat-pest' },
  { id: 'svc-pest-termite', slug: 'termite-treatment', name_en: 'Termite Treatment', short_desc_en: 'Anti-termite barrier', base_price_aed: 500, category_id: 'cat-pest' },
  { id: 'svc-pest-rodent', slug: 'rodent-control', name_en: 'Rodent Control', short_desc_en: 'Rat & mouse removal', base_price_aed: 300, category_id: 'cat-pest' },
  { id: 'svc-plumbing', slug: 'plumbing-repair', name_en: 'Standard Plumbing', short_desc_en: 'General plumbing repair', base_price_aed: 150, category_id: 'cat-plumbing' },
  { id: 'svc-drain', slug: 'drain-unblocking', name_en: 'Drain Unblocking', short_desc_en: 'Clear clogged drains', base_price_aed: 200, category_id: 'cat-plumbing' },
  { id: 'svc-waterheater', slug: 'water-heater-installation', name_en: 'Water Heater', short_desc_en: 'Install or repair water heater', base_price_aed: 300, category_id: 'cat-plumbing' },
  { id: 'svc-tank', slug: 'water-tank-cleaning', name_en: 'Water Tank Cleaning', short_desc_en: 'Clean & sanitize tank', base_price_aed: 250, category_id: 'cat-plumbing' },
  { id: 'svc-tv', slug: 'tv-mounting', name_en: 'TV Mounting & Handyman', short_desc_en: 'Mount TV & general fixes', base_price_aed: 150, category_id: 'cat-plumbing' },
  { id: 'svc-electrical', slug: 'electrical-repair', name_en: 'Standard Electrical', short_desc_en: 'Socket, switch & wiring repair', base_price_aed: 150, category_id: 'cat-electrical' },
  { id: 'svc-circuit', slug: 'circuit-breaker-repair', name_en: 'Circuit Breaker Repair', short_desc_en: 'Fix tripping breakers', base_price_aed: 200, category_id: 'cat-electrical' },
  { id: 'svc-appliance', slug: 'water-heater-repair', name_en: 'Appliance Repair', short_desc_en: 'Fix home appliances', base_price_aed: 200, category_id: 'cat-electrical' },
  { id: 'svc-smarthome', slug: 'smart-home-setup', name_en: 'Smart Home Setup', short_desc_en: 'Smart switches, locks & more', base_price_aed: 300, category_id: 'cat-electrical' },
  { id: 'svc-cctv', slug: 'cctv-installation', name_en: 'CCTV Installation', short_desc_en: 'Security camera setup', base_price_aed: 500, category_id: 'cat-electrical' },
  { id: 'svc-interior', slug: 'interior-painting', name_en: 'Interior Painting', short_desc_en: 'Apartment & room painting', base_price_aed: 700, category_id: 'cat-painting' },
  { id: 'svc-exterior', slug: 'villa-exterior-painting', name_en: 'Villa Exterior Painting', short_desc_en: 'Exterior coating & finish', base_price_aed: 3000, category_id: 'cat-painting' },
  { id: 'svc-wallpaper', slug: 'wallpaper-installation', name_en: 'Wallpaper Installation', short_desc_en: 'Professional wallpaper fitting', base_price_aed: 500, category_id: 'cat-painting' },
  { id: 'svc-bathroom', slug: 'bathroom-renovation', name_en: 'Bathroom Renovation', short_desc_en: 'Full bathroom remodel', base_price_aed: 5000, category_id: 'cat-painting' },
  { id: 'svc-flooring', slug: 'flooring-installation', name_en: 'Flooring Installation', short_desc_en: 'Tile, vinyl & wood flooring', base_price_aed: 2000, category_id: 'cat-painting' },
];

// Step 1: Service Selection
function StepService() {
  const { setService } = useBooking();
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; name_en: string; description_en: string | null }>>([]);
  const [services, setServices] = useState<Array<{ id: string; slug: string; name_en: string; short_desc_en: string | null; base_price_aed: number; category_id: string }>>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      Promise.resolve(supabase.from('service_categories').select('id, slug, name_en, description_en').eq('is_active', true).order('sort_order')).then(({ data }) => data ?? []),
      Promise.resolve(supabase.from('services').select('id, slug, name_en, short_desc_en, base_price_aed, category_id').eq('is_active', true).eq('is_hidden', false).order('sort_order')).then(({ data }) => data ?? []),
    ]).then(([cats, svcs]) => {
      setCategories(cats.length > 0 ? cats : fallbackCategories);
      setServices(svcs.length > 0 ? svcs : fallbackServices);
    }).catch(() => {
      setCategories(fallbackCategories);
      setServices(fallbackServices);
    }).finally(() => setLoaded(true));
  }, []);

  const filteredServices = selectedCat ? services.filter(s => s.category_id === selectedCat) : [];

  const isLoading = !loaded;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Select a Service</h2>
      {isLoading ? (
        <div className="py-12 text-center">
          <svg className="mx-auto mb-3 h-6 w-6 animate-spin text-accent-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">Loading services...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-2 text-lg font-medium text-foreground">No services available right now</p>
          <p className="text-sm text-muted-foreground">Please check back soon or contact us for assistance.</p>
          <a href="/contact" className="mt-4 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            Contact Us
          </a>
        </div>
      ) : !selectedCat ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className="rounded-xl border border-border p-5 text-left transition-colors hover:border-accent hover:bg-accent/5">
              <h3 className="font-semibold text-foreground">{cat.name_en}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description_en}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedCat(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to categories
          </button>
          {filteredServices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No services found in this category.</p>
              <button onClick={() => setSelectedCat(null)} className="mt-2 text-sm text-accent-text hover:underline">Browse other categories</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredServices.map(s => (
                <button key={s.id} onClick={() => setService({ categoryId: selectedCat, serviceId: s.id, serviceSlug: s.slug, serviceName: s.name_en })}
                  className="rounded-lg border border-border p-4 text-left transition-colors hover:border-accent hover:bg-accent/5">
                  <h3 className="font-medium text-foreground">{s.name_en}</h3>
                  <p className="text-xs text-muted-foreground">{s.short_desc_en}</p>
                  <p className="mt-2 text-sm font-semibold text-accent-text">From AED {s.base_price_aed}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Default variants for fallback service IDs
const fallbackVariants: Record<string, Array<{ id: string; variant_label: string; price_aed: number; duration_minutes: number }>> = {
  default: [
    { id: 'var-studio', variant_label: 'Studio / 1 BR', price_aed: 0, duration_minutes: 60 },
    { id: 'var-2br', variant_label: '2 Bedroom', price_aed: 0, duration_minutes: 90 },
    { id: 'var-3br', variant_label: '3 Bedroom', price_aed: 0, duration_minutes: 120 },
    { id: 'var-villa', variant_label: 'Villa / 4+ BR', price_aed: 0, duration_minutes: 180 },
  ],
};

// Step 2: Size/Variant Selection
function StepSize() {
  const { serviceId, setVariant, prevStep } = useBooking();
  const [variants, setVariants] = useState<Array<{ id: string; variant_label: string; price_aed: number; duration_minutes: number }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!serviceId) return;
    // If using a fallback service ID, generate default variants with the service base price
    if (serviceId.startsWith('svc-')) {
      const svc = fallbackServices.find(s => s.id === serviceId);
      const base = svc?.base_price_aed ?? 150;
      setVariants([
        { id: 'var-studio', variant_label: 'Studio / 1 BR', price_aed: base, duration_minutes: 60 },
        { id: 'var-2br', variant_label: '2 Bedroom', price_aed: Math.round(base * 1.4), duration_minutes: 90 },
        { id: 'var-3br', variant_label: '3 Bedroom', price_aed: Math.round(base * 1.8), duration_minutes: 120 },
        { id: 'var-villa', variant_label: 'Villa / 4+ BR', price_aed: Math.round(base * 2.5), duration_minutes: 180 },
      ]);
      setLoaded(true);
      return;
    }
    const supabase = createClient();
    Promise.resolve(supabase.from('service_variants').select('id, variant_label, price_aed, duration_minutes').eq('service_id', serviceId).eq('is_active', true).order('sort_order')).then(({ data }) => {
      if (data && data.length > 0) setVariants(data);
      else {
        Promise.resolve(supabase.from('services').select('base_price_aed, duration_minutes').eq('id', serviceId).single()).then(({ data: svc }) => {
          if (svc) setVariant('', 'Standard', svc.base_price_aed);
        }).catch(() => { /* service lookup failed silently */ });
      }
    }).catch(() => { /* variant lookup failed silently */ }).finally(() => setLoaded(true));
  }, [serviceId, setVariant]);

  if (!loaded || variants.length === 0) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Select Property Size</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map(v => (
          <button key={v.id} onClick={() => setVariant(v.id, v.variant_label, v.price_aed)}
            className="rounded-lg border border-border p-4 text-left transition-colors hover:border-accent hover:bg-accent/5">
            <h3 className="font-semibold text-foreground">{v.variant_label}</h3>
            <p className="text-xs text-muted-foreground">{v.duration_minutes} minutes</p>
            <p className="mt-2 text-lg font-bold text-foreground">AED {v.price_aed}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Add-ons
function StepAddons() {
  const { serviceId, addonIds, toggleAddon, nextStep, prevStep } = useBooking();
  const [addons, setAddons] = useState<Array<{ id: string; name_en: string; price_aed: number; duration_minutes: number }>>([]);

  useEffect(() => {
    if (!serviceId) return;
    const supabase = createClient();
    Promise.resolve(supabase.from('service_addons').select('id, name_en, price_aed, duration_minutes').eq('service_id', serviceId).eq('is_active', true).order('sort_order')).then(({ data }) => setAddons(data ?? [])).catch(() => setAddons([]));
  }, [serviceId]);

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Add Extras (Optional)</h2>
      {addons.length === 0 ? (
        <p className="mb-4 text-muted-foreground">No add-ons available for this service.</p>
      ) : (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {addons.map(a => {
            const selected = addonIds.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggleAddon(a.id, a.price_aed)}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${selected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                <div>
                  <h3 className="font-medium text-foreground">{a.name_en}</h3>
                  {a.duration_minutes > 0 && <p className="text-xs text-muted-foreground">+{a.duration_minutes} min</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-accent-text">+AED {a.price_aed}</span>
                  <div className={`flex h-5 w-5 items-center justify-center rounded border ${selected ? 'border-accent bg-accent' : 'border-border'}`}>
                    {selected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <button onClick={nextStep} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
        Continue <ArrowRight className="ml-1 inline h-4 w-4" />
      </button>
    </div>
  );
}

// Step 4: Location
function StepLocation() {
  const { setAddress, prevStep, serviceId } = useBooking();
  const [buildingName, setBuildingName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [area, setArea] = useState('');
  const [areas, setAreas] = useState<Array<{ slug: string; name_en: string }>>([]);
  const [areaError, setAreaError] = useState('');
  const [validatedAreaId, setValidatedAreaId] = useState<string | null>(null);

  useEffect(() => {
    const fallbackAreas = [
      { slug: 'dubai-marina', name_en: 'Dubai Marina' },
      { slug: 'jbr', name_en: 'JBR' },
      { slug: 'palm-jumeirah', name_en: 'Palm Jumeirah' },
      { slug: 'downtown-dubai', name_en: 'Downtown Dubai' },
      { slug: 'business-bay', name_en: 'Business Bay' },
      { slug: 'difc', name_en: 'DIFC' },
      { slug: 'jlt', name_en: 'JLT' },
      { slug: 'dubai-hills', name_en: 'Dubai Hills' },
      { slug: 'arabian-ranches', name_en: 'Arabian Ranches' },
      { slug: 'jumeirah', name_en: 'Jumeirah' },
      { slug: 'al-barsha', name_en: 'Al Barsha' },
      { slug: 'mirdif', name_en: 'Mirdif' },
      { slug: 'silicon-oasis', name_en: 'Dubai Silicon Oasis' },
      { slug: 'sports-city', name_en: 'Dubai Sports City' },
      { slug: 'motor-city', name_en: 'Motor City' },
      { slug: 'discovery-gardens', name_en: 'Discovery Gardens' },
      { slug: 'al-quoz', name_en: 'Al Quoz' },
      { slug: 'jumeirah-village-circle', name_en: 'JVC' },
      { slug: 'damac-hills', name_en: 'Damac Hills' },
      { slug: 'town-square', name_en: 'Town Square' },
    ];
    fetch('/api/v1/public/areas')
      .then(res => res.json())
      .then(data => setAreas(data && data.length > 0 ? data : fallbackAreas))
      .catch(() => setAreas(fallbackAreas));
  }, []);

  // Validate selected area is serviced when area changes
  useEffect(() => {
    if (!area || !serviceId) { setAreaError(''); setValidatedAreaId(null); return; }
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from('areas')
      .select('id, is_active')
      .eq('slug', area)
      .eq('is_active', true)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          // Allow booking in any listed area (fallback-friendly)
          setAreaError('');
          setValidatedAreaId(null);
        } else {
          setAreaError('');
          setValidatedAreaId(data.id);
        }
      });
    return () => { cancelled = true; };
  }, [area, serviceId]);

  const handleContinue = () => {
    const areaName = areas.find(a => a.slug === area)?.name_en ?? area;
    const parts = [unitNumber, buildingName, areaName, 'Dubai'].filter(Boolean);
    const addressString = parts.join(', ');
    setAddress(addressString, validatedAreaId ?? undefined, undefined, area);
  };

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Service Location</h2>

      {/* Map placeholder */}
      <div className="mb-6 relative h-40 w-full overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-accent-text" />
            <p className="text-sm font-medium text-foreground">Dubai, UAE</p>
            <p className="text-xs text-muted-foreground">Select your area below</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Area</label>
          <select value={area} onChange={e => setArea(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none">
            <option value="">Select area</option>
            {areas.map(a => (
              <option key={a.slug} value={a.slug}>{a.name_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Building Name</label>
          <input type="text" value={buildingName} onChange={e => setBuildingName(e.target.value)} placeholder="e.g. Marina Gate 1" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Unit / Apartment Number</label>
          <input type="text" value={unitNumber} onChange={e => setUnitNumber(e.target.value)} placeholder="e.g. 2304" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        {areaError && (
          <p className="text-sm text-destructive">{areaError}</p>
        )}
        <button onClick={handleContinue} disabled={!area || !buildingName || !!areaError}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50">
          Continue <ArrowRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Step 5: Schedule
function StepSchedule() {
  const { setSchedule, setExpress, isExpress, prevStep } = useBooking();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const slots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { value: d.toISOString().split('T')[0]!, label: d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Pick Date & Time</h2>

      {/* Express toggle */}
      <button onClick={() => setExpress(!isExpress)} className={`mb-6 flex w-full items-center justify-between rounded-lg border p-4 ${isExpress ? 'border-yellow-500 bg-yellow-50' : 'border-border'}`}>
        <div className="flex items-center gap-2">
          <Zap className={`h-5 w-5 ${isExpress ? 'text-yellow-600' : 'text-muted-foreground'}`} />
          <div className="text-left">
            <p className="font-medium text-foreground">Express Service (Today)</p>
            <p className="text-xs text-muted-foreground">+50% surcharge for same-day service</p>
          </div>
        </div>
        <div className={`h-5 w-9 rounded-full p-0.5 ${isExpress ? 'bg-yellow-500' : 'bg-gray-300'}`}>
          <div className={`h-4 w-4 rounded-full bg-white transition-transform ${isExpress ? 'translate-x-4' : ''}`} />
        </div>
      </button>

      {/* Date picker */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-foreground"><Calendar className="mr-1 inline h-4 w-4" /> Select Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map(d => (
            <button key={d.value} onClick={() => setSelectedDate(d.value)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm ${selectedDate === d.value ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-foreground hover:border-accent/50'}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-foreground"><Clock className="mr-1 inline h-4 w-4" /> Select Time</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {slots.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)}
                className={`rounded-lg border px-3 py-2 text-sm ${selectedSlot === slot ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-foreground hover:border-accent/50'}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedSlot && (
        <button onClick={() => setSchedule(selectedDate, selectedSlot)} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          Continue <ArrowRight className="ml-1 inline h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Step 6: Account (simplified)
function StepAccount() {
  const { nextStep, prevStep, setNotes, setCustomerDetails, notesCustomer } = useBooking();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setLocalNotes] = useState(notesCustomer);

  // Pre-fill from Supabase auth if available
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? '');
        setFullName(user.user_metadata?.full_name ?? '');
        setPhone(user.user_metadata?.phone ?? '');
      }
    }).catch(() => { /* auth check failed, user will fill in manually */ });
  }, []);

  const handleContinue = () => {
    setNotes(notes);
    setCustomerDetails(fullName, phone, email);
    nextStep();
  };

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Your Details</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 XXX XXXX" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Special Instructions (Optional)</label>
          <textarea value={notes} onChange={e => setLocalNotes(e.target.value)} placeholder="Gate code, parking info, pet in the house..." rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <button onClick={handleContinue} disabled={!fullName || !phone || !email} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50">
          Continue to Review <ArrowRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Step 7: Review & Pay
function StepReview() {
  const booking = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'tabby' | 'cash'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = booking.basePrice + booking.addonsTotal;
  const expressSurcharge = booking.isExpress ? Math.round(subtotal * 0.5 * 100) / 100 : 0;
  const vat = Math.round((subtotal + expressSurcharge - promoDiscount) * 0.05 * 100) / 100;
  const total = subtotal + expressSurcharge - promoDiscount + vat;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    try {
      const res = await fetch('/api/v1/public/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || 'Invalid promo code');
        setPromoDiscount(0);
        setPromoApplied(false);
        return;
      }
      setPromoDiscount(data.discount ?? 0);
      setPromoApplied(true);
      booking.setPromoCode(promoCode.trim());
    } catch {
      setPromoError('Failed to validate promo code');
    }
  };

  const handleConfirm = async () => {
    setOrderError('');
    // Check if user is logged in
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login with return URL
      window.location.href = '/login?redirect=/book';
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: booking.serviceId,
          variantId: booking.variantId,
          addonIds: booking.addonIds,
          scheduledDate: booking.scheduledDate,
          scheduledTimeSlot: booking.scheduledTimeSlot,
          areaId: booking.areaId || null,
          buildingId: booking.buildingId || null,
          isExpress: booking.isExpress,
          promoCode: booking.promoCode,
          notesCustomer: booking.notesCustomer,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          baseAmount: booking.basePrice,
          addonsAmount: booking.addonsTotal,
          expressSurcharge,
          discount: promoDiscount,
          vat,
          total,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setOrderError(err.error || 'Failed to create order');
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      // After order creation success
      if (paymentMethod === 'card') {
        const checkoutRes = await fetch('/api/v1/customer/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.id }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
      }
      // For cash/other, just go to confirmation
      booking.nextStep();
    } catch {
      setOrderError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <button onClick={booking.prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent-text hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Review Your Booking</h2>

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium text-foreground">{booking.serviceName}</span></div>
          {booking.variantLabel && <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-foreground">{booking.variantLabel}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{booking.scheduledDate}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground">{booking.scheduledTimeSlot}</span></div>
          {booking.isExpress && <div className="flex justify-between"><span className="text-yellow-600 font-medium">Express Service</span><span className="text-yellow-600">+50%</span></div>}

          <div className="border-t border-border pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-foreground">AED {booking.basePrice.toFixed(2)}</span></div>
            {booking.addonsTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span className="text-foreground">AED {booking.addonsTotal.toFixed(2)}</span></div>}
            {expressSurcharge > 0 && <div className="flex justify-between"><span className="text-yellow-600">Express surcharge</span><span className="text-yellow-600">AED {expressSurcharge.toFixed(2)}</span></div>}
            {promoDiscount > 0 && <div className="flex justify-between"><span className="text-green-600">Promo discount</span><span className="text-green-600">-AED {promoDiscount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">VAT (5%)</span><span className="text-foreground">AED {vat.toFixed(2)}</span></div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-bold"><span className="text-foreground">Total</span><span className="text-foreground">AED {total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Promo code */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Promo Code</label>
        <div className="flex gap-2">
          <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code" disabled={promoApplied} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none disabled:opacity-50" />
          {promoApplied ? (
            <button onClick={() => { setPromoApplied(false); setPromoDiscount(0); setPromoCode(''); booking.setPromoCode(null); }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Remove</button>
          ) : (
            <button onClick={handleApplyPromo} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Apply</button>
          )}
        </div>
        {promoError && <p className="mt-1 text-xs text-red-600">{promoError}</p>}
        {promoApplied && <p className="mt-1 text-xs text-green-600">Promo applied! You save AED {promoDiscount.toFixed(2)}</p>}
      </div>

      {/* Payment */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-foreground"><CreditCard className="mr-1 inline h-4 w-4" /> Payment Method</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {([
            { key: 'card' as const, label: 'Pay Online (Card)' },
            { key: 'tabby' as const, label: 'Pay Later (Tabby)' },
            { key: 'cash' as const, label: 'Cash on Service' },
          ]).map((method) => (
            <button key={method.key} onClick={() => setPaymentMethod(method.key)}
              className={`rounded-lg border p-3 text-sm ${paymentMethod === method.key ? 'border-accent bg-accent/5 font-medium text-foreground' : 'border-border text-muted-foreground hover:border-accent/50'}`}>
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {orderError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{orderError}</p>
      )}

      <button onClick={handleConfirm} disabled={submitting} className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50">
        {submitting ? 'Creating order...' : `Confirm & Pay AED ${total.toFixed(2)}`}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">Free cancellation up to 12 hours before service</p>
    </div>
  );
}

// Step 8: Confirmation
function StepDone() {
  const booking = useBooking();
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed!</h2>
      <p className="mb-6 text-muted-foreground">Your booking has been received. We will assign a technician shortly.</p>

      <div className="mx-auto max-w-sm rounded-xl border border-border bg-card p-6 text-left text-sm">
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium text-foreground">{booking.serviceName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{booking.scheduledDate}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground">{booking.scheduledTimeSlot}</span></div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a href="/account" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          View My Bookings
        </a>
        <button onClick={booking.reset} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
          Book Another Service
        </button>
      </div>

      {/* Care Plan Upsell */}
      <div className="mt-8 rounded-xl bg-primary p-6 text-primary-foreground">
        <h3 className="mb-2 font-semibold">Save 40% with a Care Plan</h3>
        <p className="mb-4 text-sm text-primary-foreground/70">Get priority service, dedicated support, and bundled maintenance from AED 79/month.</p>
        <a href="/care-plans" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
          View Care Plans
        </a>
      </div>
    </div>
  );
}

// Main booking page
export default function BookPage() {
  const { step } = useBooking();

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-foreground">Book a Service</h1>
          <p className="text-sm text-muted-foreground">{siteConfig.name} — {siteConfig.tagline}</p>
        </div>

        <StepProgress current={step} />

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && <StepService />}
          {step === 2 && <StepSize />}
          {step === 3 && <StepAddons />}
          {step === 4 && <StepLocation />}
          {step === 5 && <StepSchedule />}
          {step === 6 && <StepAccount />}
          {step === 7 && <StepReview />}
          {step === 8 && <StepDone />}
        </div>
      </div>
    </div>
  );
}
