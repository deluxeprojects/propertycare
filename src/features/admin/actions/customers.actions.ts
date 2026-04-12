'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import { revalidatePath } from 'next/cache';

export async function updateCustomerProfile(customerId: string, updates: { fullName?: string; phone?: string }) {
  await requireAdmin();
  const supabase = createAdminClient();
  const dbUpdates: Record<string, unknown> = {};
  if (updates.fullName) dbUpdates.full_name = updates.fullName;
  if (updates.phone) dbUpdates.phone = updates.phone;

  const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', customerId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/customers');
}

export async function addWalletCredit(customerId: string, amount: number, notes: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  // Get or create wallet
  let { data: wallet } = await supabase
    .from('customer_wallets')
    .select('id, balance_aed, total_earned_aed')
    .eq('customer_id', customerId)
    .single();

  if (!wallet) {
    const { data: newWallet, error: createError } = await supabase
      .from('customer_wallets')
      .insert({ customer_id: customerId, balance_aed: 0, total_earned_aed: 0, total_spent_aed: 0 })
      .select()
      .single();
    if (createError) throw new Error(createError.message);
    wallet = newWallet;
  }

  if (!wallet) throw new Error('Could not create wallet');

  const newBalance = (wallet.balance_aed ?? 0) + amount;

  // Update wallet
  await supabase
    .from('customer_wallets')
    .update({ balance_aed: newBalance, total_earned_aed: (wallet.total_earned_aed ?? 0) + amount })
    .eq('id', wallet.id);

  // Record transaction
  await supabase.from('wallet_transactions').insert({
    wallet_id: wallet.id,
    type: 'credit_manual',
    amount_aed: amount,
    balance_after_aed: newBalance,
    notes,
  });

  revalidatePath(`/admin/customers/${customerId}`);
}
