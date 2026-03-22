'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createService(data: {
  categoryId: string;
  slug: string;
  serviceCode: string;
  nameEn: string;
  shortDescEn?: string;
  longDescEn?: string;
  basePriceAed: number;
  priceUnit: string;
  durationMinutes: number;
  tags?: string[];
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('services').insert({
    category_id: data.categoryId,
    slug: data.slug,
    service_code: data.serviceCode,
    name_en: data.nameEn,
    short_desc_en: data.shortDescEn,
    long_desc_en: data.longDescEn,
    base_price_aed: data.basePriceAed,
    price_unit: data.priceUnit,
    duration_minutes: data.durationMinutes,
    tags: data.tags ?? [],
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}

export async function updateService(serviceId: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('services').update(updates).eq('id', serviceId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}

export async function toggleServiceActive(serviceId: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('services').update({ is_active: isActive }).eq('id', serviceId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}

export async function createVariant(data: { serviceId: string; variantLabel: string; priceAed: number; durationMinutes: number; sortOrder?: number }) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('service_variants').insert({
    service_id: data.serviceId,
    variant_label: data.variantLabel,
    price_aed: data.priceAed,
    duration_minutes: data.durationMinutes,
    sort_order: data.sortOrder ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}

export async function createAddon(data: { serviceId: string; nameEn: string; priceAed: number; durationMinutes?: number; sortOrder?: number }) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('service_addons').insert({
    service_id: data.serviceId,
    name_en: data.nameEn,
    price_aed: data.priceAed,
    duration_minutes: data.durationMinutes ?? 0,
    sort_order: data.sortOrder ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}
