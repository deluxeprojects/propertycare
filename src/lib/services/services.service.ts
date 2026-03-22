import type { SupabaseClient } from '@supabase/supabase-js';

export async function getActiveServices(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories(id, slug, name_en),
      service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active),
      service_addons(id, name_en, price_aed, duration_minutes, sort_order, is_active)
    `)
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function getServiceBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories(id, slug, name_en),
      service_variants(id, variant_label, price_aed, duration_minutes, sort_order, is_active),
      service_addons(id, name_en, price_aed, duration_minutes, sort_order, is_active)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getServicesByCategory(supabase: SupabaseClient, categorySlug: string) {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories!inner(id, slug, name_en),
      service_variants(id, variant_label, price_aed, duration_minutes, sort_order),
      service_addons(id, name_en, price_aed, duration_minutes, sort_order)
    `)
    .eq('service_categories.slug', categorySlug)
    .eq('is_active', true)
    .eq('is_hidden', false)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function getCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}
