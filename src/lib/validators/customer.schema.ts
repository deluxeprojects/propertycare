import { z } from 'zod/v4';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  preferredLanguage: z.enum(['en', 'ar', 'ru', 'zh', 'de']).optional(),
});

export const createAddressSchema = z.object({
  label: z.string().optional().default('Home'),
  areaId: z.uuid().optional(),
  buildingId: z.uuid().optional(),
  buildingName: z.string().optional(),
  unitNumber: z.string().optional(),
  floor: z.string().optional(),
  streetAddress: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  googlePlaceId: z.string().optional(),
  specialInstructions: z.string().max(500).optional(),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();
