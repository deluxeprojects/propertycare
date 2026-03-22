import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { searchServices } from '@/config/search-keywords';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return apiSuccess({ services: [], areas: [] });
    }

    const supabase = createAdminClient();

    // 1. Search services by keyword synonyms
    const matchedSlugs = searchServices(query);

    // 2. Also search by service name directly in DB
    const { data: nameMatches } = await supabase
      .from('services')
      .select('id, slug, name_en, short_desc_en, base_price_aed, price_unit, service_categories(slug, name_en)')
      .eq('is_active', true)
      .eq('is_hidden', false)
      .ilike('name_en', `%${query}%`)
      .limit(10);

    // 3. Get services by synonym-matched slugs
    let synonymMatches: typeof nameMatches = [];
    if (matchedSlugs.length > 0) {
      const { data } = await supabase
        .from('services')
        .select('id, slug, name_en, short_desc_en, base_price_aed, price_unit, service_categories(slug, name_en)')
        .eq('is_active', true)
        .eq('is_hidden', false)
        .in('slug', matchedSlugs)
        .limit(10);
      synonymMatches = data;
    }

    // 4. Merge and deduplicate
    const seen = new Set<string>();
    const services = [];
    for (const s of [...(nameMatches ?? []), ...(synonymMatches ?? [])]) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        services.push(s);
      }
    }

    // 5. Search areas
    const { data: areas } = await supabase
      .from('areas')
      .select('id, slug, name_en, zone_group')
      .eq('is_active', true)
      .ilike('name_en', `%${query}%`)
      .limit(5);

    return apiSuccess({
      services: services.slice(0, 10),
      areas: areas ?? [],
      query,
    });
  } catch {
    return apiError('Search failed', 'INTERNAL_ERROR', 500);
  }
}
