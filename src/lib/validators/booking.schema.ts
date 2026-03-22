import { z } from 'zod/v4';

export const createBookingSchema = z.object({
  serviceId: z.uuid(),
  variantId: z.uuid().optional(),
  addonIds: z.array(z.uuid()).optional().default([]),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduledTimeSlot: z.string(),
  addressId: z.uuid(),
  areaId: z.uuid().optional(),
  buildingId: z.uuid().optional(),
  isExpress: z.boolean().optional().default(false),
  promoCode: z.string().optional(),
  notesCustomer: z.string().max(500).optional(),
  source: z.enum(['website', 'whatsapp', 'phone', 'admin', 'api']).optional().default('website'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const cancelBookingSchema = z.object({
  reason: z.string().min(1).max(500),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
