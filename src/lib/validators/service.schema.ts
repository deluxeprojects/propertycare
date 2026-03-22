import { z } from 'zod/v4';

export const createServiceSchema = z.object({
  categoryId: z.uuid(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  serviceCode: z.string().min(3).max(20),
  nameEn: z.string().min(2).max(200),
  shortDescEn: z.string().max(80).optional(),
  longDescEn: z.string().optional(),
  basePriceAed: z.number().positive(),
  priceUnit: z.enum(['per_service', 'per_hour', 'per_sqft', 'per_room']),
  durationMinutes: z.number().int().positive(),
  minBookingHours: z.number().int().optional().default(24),
  maxReschedules: z.number().int().optional().default(2),
  requiresAssessment: z.boolean().optional().default(false),
  isExpressAvailable: z.boolean().optional().default(false),
  expressSurchargePct: z.number().optional().default(50),
  tags: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isHidden: z.boolean().optional().default(false),
});

export const createVariantSchema = z.object({
  serviceId: z.uuid(),
  variantLabel: z.string().min(1).max(50),
  priceAed: z.number().positive(),
  durationMinutes: z.number().int().positive(),
  sortOrder: z.number().int().optional().default(0),
});

export const createAddonSchema = z.object({
  serviceId: z.uuid(),
  nameEn: z.string().min(1).max(200),
  priceAed: z.number().positive(),
  durationMinutes: z.number().int().optional().default(0),
  sortOrder: z.number().int().optional().default(0),
});
