'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateSetting(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('system_settings')
    .update({ value: JSON.stringify(value) })
    .eq('key', key);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/settings');
}

export async function seedDefaultSettings() {
  const supabase = createAdminClient();
  const defaults = [
    { key: 'business.company_name', value: '"ProKeep"', category: 'business', label: 'Company Name' },
    { key: 'business.vat_pct', value: '5', category: 'business', label: 'VAT %' },
    { key: 'business.currency', value: '"AED"', category: 'business', label: 'Currency' },
  ];

  for (const setting of defaults) {
    await supabase.from('system_settings').upsert(setting, { onConflict: 'key' });
  }

  revalidatePath('/admin/settings');
}
