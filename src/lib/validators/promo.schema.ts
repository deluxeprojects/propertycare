import { z } from 'zod/v4';

export const createPromoSchema = z.object({
  code: z.string().min(3).max(20).transform(v => v.toUpperCase()),
  name: z.string().min(2).max(100),
  descriptionEn: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed_amount', 'free_addon', 'free_service']),
  discountValue: z.number().positive(),
  minOrderAed: z.number().optional().default(0),
  maxDiscountAed: z.number().optional(),
  usageLimitTotal: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().optional().default(1),
  validFrom: z.string(),
  validUntil: z.string(),
  isPublic: z.boolean().optional().default(false),
  isFirstOrderOnly: z.boolean().optional().default(false),
  isAmcEligible: z.boolean().optional().default(false),
});

export const validatePromoSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().optional(),
  serviceId: z.uuid().optional(),
  customerId: z.uuid().optional(),
});
