import { z } from 'zod/v4';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'assigned', 'in_transit', 'in_progress', 'completed', 'cancelled', 'refunded', 'disputed']),
  notes: z.string().optional(),
});

export const assignTechnicianSchema = z.object({
  technicianProfileId: z.uuid(),
});

export const rescheduleOrderSchema = z.object({
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduledTimeSlot: z.string(),
});

export const issueRefundSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.string().min(1).max(500),
  fullRefund: z.boolean().optional().default(false),
});
