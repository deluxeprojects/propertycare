'use client';

import { create } from 'zustand';

interface BookingState {
  step: number;
  categoryId: string | null;
  serviceId: string | null;
  serviceSlug: string | null;
  serviceName: string | null;
  variantId: string | null;
  variantLabel: string | null;
  addonIds: string[];
  addressId: string | null;
  areaId: string | null;
  areaSlug: string | null;
  buildingId: string | null;
  scheduledDate: string | null;
  scheduledTimeSlot: string | null;
  isExpress: boolean;
  promoCode: string | null;
  notesCustomer: string;

  // Computed prices
  basePrice: number;
  addonsTotal: number;
  expressSurcharge: number;
  discount: number;
  vat: number;
  total: number;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (data: { categoryId: string; serviceId: string; serviceSlug: string; serviceName: string }) => void;
  setVariant: (variantId: string, label: string, price: number) => void;
  toggleAddon: (addonId: string, price: number) => void;
  setAddress: (addressId: string, areaId?: string, buildingId?: string, areaSlug?: string) => void;
  setSchedule: (date: string, timeSlot: string) => void;
  setExpress: (isExpress: boolean) => void;
  setPromoCode: (code: string | null) => void;
  setNotes: (notes: string) => void;
  setPrices: (prices: { basePrice: number; addonsTotal: number; expressSurcharge: number; discount: number; vat: number; total: number }) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  categoryId: null,
  serviceId: null,
  serviceSlug: null,
  serviceName: null,
  variantId: null,
  variantLabel: null,
  addonIds: [] as string[],
  addressId: null,
  areaId: null,
  areaSlug: null,
  buildingId: null,
  scheduledDate: null,
  scheduledTimeSlot: null,
  isExpress: false,
  promoCode: null,
  notesCustomer: '',
  basePrice: 0,
  addonsTotal: 0,
  expressSurcharge: 0,
  discount: 0,
  vat: 0,
  total: 0,
};

export const useBooking = create<BookingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 8) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  setService: (data) => set({
    categoryId: data.categoryId,
    serviceId: data.serviceId,
    serviceSlug: data.serviceSlug,
    serviceName: data.serviceName,
    step: 2,
  }),

  setVariant: (variantId, label, price) => set({
    variantId,
    variantLabel: label,
    basePrice: price,
    step: 3,
  }),

  toggleAddon: (addonId, price) => set((state) => {
    const exists = state.addonIds.includes(addonId);
    return {
      addonIds: exists
        ? state.addonIds.filter((id) => id !== addonId)
        : [...state.addonIds, addonId],
      addonsTotal: exists
        ? state.addonsTotal - price
        : state.addonsTotal + price,
    };
  }),

  setAddress: (addressId, areaId, buildingId, areaSlug) => set({
    addressId,
    areaId: areaId ?? null,
    buildingId: buildingId ?? null,
    areaSlug: areaSlug ?? null,
    step: 5,
  }),

  setSchedule: (date, timeSlot) => set({
    scheduledDate: date,
    scheduledTimeSlot: timeSlot,
    step: 6,
  }),

  setExpress: (isExpress) => set({ isExpress }),
  setPromoCode: (code) => set({ promoCode: code }),
  setNotes: (notes) => set({ notesCustomer: notes }),

  setPrices: (prices) => set(prices),

  reset: () => set(initialState),
}));
