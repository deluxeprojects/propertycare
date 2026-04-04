import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Unauthorized', 'UNAUTHORIZED', 401);

    const { data: wallet } = await supabase
      .from('customer_wallets')
      .select('*')
      .eq('customer_id', user.id)
      .single();

    let transactions: unknown[] = [];
    if (wallet?.id) {
      const { data: txns } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(50);
      transactions = txns ?? [];
    }

    return apiSuccess({ wallet, transactions });
  } catch {
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
