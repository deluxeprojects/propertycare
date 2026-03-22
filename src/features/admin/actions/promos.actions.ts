'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createPromo(data: {
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  minOrderAed?: number;
  maxDiscountAed?: number;
  usageLimitTotal?: number;
  usageLimitPerUser?: number;
  validFrom: string;
  validUntil: string;
  isPublic?: boolean;
  isFirstOrderOnly?: boolean;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('promotions').insert({
    code: data.code.toUpperCase(),
    name: data.name,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    min_order_aed: data.minOrderAed ?? 0,
    max_discount_aed: data.maxDiscountAed,
    usage_limit_total: data.usageLimitTotal,
    usage_limit_per_user: data.usageLimitPerUser ?? 1,
    valid_from: data.validFrom,
    valid_until: data.validUntil,
    is_public: data.isPublic ?? false,
    is_first_order_only: data.isFirstOrderOnly ?? false,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/promos');
}

export async function deactivatePromo(promoId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('promotions').update({ is_active: false }).eq('id', promoId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/promos');
}
