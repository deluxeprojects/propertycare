'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateAreaPage(areaId: string, data: { descriptionEn?: string; metaTitleEn?: string; metaDescEn?: string }) {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (data.descriptionEn) updates.description_en = data.descriptionEn;
  if (data.metaTitleEn) updates.meta_title_en = data.metaTitleEn;
  if (data.metaDescEn) updates.meta_desc_en = data.metaDescEn;

  const { error } = await supabase.from('areas').update(updates).eq('id', areaId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function updateBuildingPage(buildingId: string, data: { descriptionEn?: string; noindex?: boolean }) {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (data.descriptionEn !== undefined) updates.description_en = data.descriptionEn;
  if (data.noindex !== undefined) updates.noindex = data.noindex;

  const { error } = await supabase.from('buildings').update(updates).eq('id', buildingId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function togglePageNoindex(entityType: 'area' | 'building', entityId: string, noindex: boolean) {
  const supabase = createAdminClient();
  const table = entityType === 'area' ? 'areas' : 'buildings';
  const updates = entityType === 'area' ? { is_active: !noindex } : { noindex };
  const { error } = await supabase.from(table).update(updates).eq('id', entityId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}
