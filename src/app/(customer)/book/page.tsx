'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBooking } from '@/features/customer/hooks/useBooking';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Calendar, CreditCard, Zap } from 'lucide-react';

// Step indicators
function StepProgress({ current }: { current: number }) {
  const steps = ['Service', 'Size', 'Add-ons', 'Location', 'Schedule', 'Account', 'Review', 'Done'];
  return (
    <div className="mb-8 flex overflow-x-auto pb-2">
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
  );
}

// Step 1: Service Selection
function StepService() {
  const { setService } = useBooking();
  const [categories, setCategories] = useState<Array<{ id: string; slug: string; name_en: string; description_en: string | null }>>([]);
  const [services, setServices] = useState<Array<{ id: string; slug: string; name_en: string; short_desc_en: string | null; base_price_aed: number; category_id: string }>>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('service_categories').select('id, slug, name_en, description_en').eq('is_active', true).order('sort_order').then(({ data }) => setCategories(data ?? []));
    supabase.from('services').select('id, slug, name_en, short_desc_en, base_price_aed, category_id').eq('is_active', true).eq('is_hidden', false).order('sort_order').then(({ data }) => setServices(data ?? []));
  }, []);

  const filteredServices = selectedCat ? services.filter(s => s.category_id === selectedCat) : [];

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Select a Service</h2>
      {!selectedCat ? (
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
          <button onClick={() => setSelectedCat(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to categories
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredServices.map(s => (
              <button key={s.id} onClick={() => setService({ categoryId: selectedCat, serviceId: s.id, serviceSlug: s.slug, serviceName: s.name_en })}
                className="rounded-lg border border-border p-4 text-left transition-colors hover:border-accent hover:bg-accent/5">
                <h3 className="font-medium text-foreground">{s.name_en}</h3>
                <p className="text-xs text-muted-foreground">{s.short_desc_en}</p>
                <p className="mt-2 text-sm font-semibold text-accent">From AED {s.base_price_aed}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2: Size/Variant Selection
function StepSize() {
  const { serviceId, setVariant, prevStep } = useBooking();
  const [variants, setVariants] = useState<Array<{ id: string; variant_label: string; price_aed: number; duration_minutes: number }>>([]);

  useEffect(() => {
    if (!serviceId) return;
    const supabase = createClient();
    supabase.from('service_variants').select('id, variant_label, price_aed, duration_minutes').eq('service_id', serviceId).eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setVariants(data);
      else {
        // No variants — get base price and auto-advance
        supabase.from('services').select('base_price_aed, duration_minutes').eq('id', serviceId).single().then(({ data: svc }) => {
          if (svc) setVariant('', 'Standard', svc.base_price_aed);
        });
      }
    });
  }, [serviceId, setVariant]);

  if (variants.length === 0) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
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
    supabase.from('service_addons').select('id, name_en, price_aed, duration_minutes').eq('service_id', serviceId).eq('is_active', true).order('sort_order').then(({ data }) => setAddons(data ?? []));
  }, [serviceId]);

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
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
                  <span className="text-sm font-semibold text-accent">+AED {a.price_aed}</span>
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
  const { setAddress, prevStep } = useBooking();
  const [buildingName, setBuildingName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [area, setArea] = useState('');

  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Service Location</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Area</label>
          <select value={area} onChange={e => setArea(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none">
            <option value="">Select area</option>
            <option value="dubai-marina">Dubai Marina</option>
            <option value="downtown-dubai">Downtown Dubai</option>
            <option value="jbr">JBR</option>
            <option value="palm-jumeirah">Palm Jumeirah</option>
            <option value="business-bay">Business Bay</option>
            <option value="jlt">JLT</option>
            <option value="dubai-hills">Dubai Hills</option>
            <option value="arabian-ranches">Arabian Ranches</option>
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
        <button onClick={() => setAddress('temp-address', undefined, undefined, area)} disabled={!area || !buildingName}
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
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
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
  const { nextStep, prevStep } = useBooking();
  return (
    <div>
      <button onClick={prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h2 className="mb-4 text-xl font-semibold text-foreground">Your Details</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
          <input type="text" placeholder="Your name" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
          <input type="tel" placeholder="+971 50 XXX XXXX" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <input type="email" placeholder="your@email.com" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Special Instructions (Optional)</label>
          <textarea placeholder="Gate code, parking info, pet in the house..." rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
        </div>
        <button onClick={nextStep} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
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
  const vat = Math.round((booking.basePrice + booking.addonsTotal) * 0.05 * 100) / 100;
  const expressSurcharge = booking.isExpress ? Math.round((booking.basePrice + booking.addonsTotal) * 0.5 * 100) / 100 : 0;
  const total = booking.basePrice + booking.addonsTotal + expressSurcharge + vat;

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
          baseAmount: booking.basePrice,
          addonsAmount: booking.addonsTotal,
          expressSurcharge,
          discount: booking.discount,
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

      // Order created — advance to confirmation
      booking.nextStep();
    } catch {
      setOrderError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <button onClick={booking.prevStep} className="mb-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
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
          <input type="text" placeholder="Enter code" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none" />
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Apply</button>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-foreground"><CreditCard className="mr-1 inline h-4 w-4" /> Payment Method</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {['Pay Online (Card)', 'Pay Later (Tabby)', 'Cash on Service'].map((method, i) => (
            <button key={method} className={`rounded-lg border p-3 text-sm ${i === 0 ? 'border-accent bg-accent/5 font-medium text-foreground' : 'border-border text-muted-foreground hover:border-accent/50'}`}>
              {method}
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
