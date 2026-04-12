'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import { revalidatePath } from 'next/cache';

export async function updatePlanPricing(pricingId: string, data: { annualPriceAed: number; monthlyPriceAed: number; quarterlyPriceAed: number }) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from('amc_plan_pricing').update({
    annual_price_aed: data.annualPriceAed,
    monthly_price_aed: data.monthlyPriceAed,
    quarterly_price_aed: data.quarterlyPriceAed,
  }).eq('id', pricingId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/care-plans');
}

export async function createSubscription(data: {
  customerId: string;
  planId: string;
  planPricingId: string;
  addressId: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
}) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from('amc_subscriptions').insert({
    customer_id: data.customerId,
    plan_id: data.planId,
    plan_pricing_id: data.planPricingId,
    address_id: data.addressId,
    billing_cycle: data.billingCycle,
    start_date: data.startDate,
    end_date: data.endDate,
    status: 'active',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/care-plans');
}

export async function pauseSubscription(subscriptionId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from('amc_subscriptions').update({ status: 'paused' }).eq('id', subscriptionId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/care-plans');
}

export async function cancelSubscription(subscriptionId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from('amc_subscriptions').update({ status: 'cancelled' }).eq('id', subscriptionId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/care-plans');
}
