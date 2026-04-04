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

    // Sanitize query for use in ilike filters
    const sanitizedQuery = query.replace(/[%_(),."'\\]/g, '');
    if (sanitizedQuery.length < 2) {
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
      .ilike('name_en', `%${sanitizedQuery}%`)
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
      .ilike('name_en', `%${sanitizedQuery}%`)
      .limit(5);

    // 6. Static page matches
    const staticPages = [
      { slug: 'guardian', name: 'Property Guardian — Home Watch', href: '/home-services/guardian' },
      { slug: 'care-plans', name: 'Care Plans — Annual Service Contracts', href: '/care-plans' },
    ];
    const pageMatches = staticPages.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.includes(query.toLowerCase()) ||
      query.toLowerCase().includes('guardian') ||
      query.toLowerCase().includes('home watch') ||
      query.toLowerCase().includes('property watch') ||
      query.toLowerCase().includes('absentee') ||
      (query.toLowerCase().includes('care plan') && p.slug === 'care-plans') ||
      (query.toLowerCase().includes('annual') && p.slug === 'care-plans')
    );

    return apiSuccess({
      services: services.slice(0, 10),
      areas: areas ?? [],
      pages: pageMatches,
      query,
    });
  } catch {
    return apiError('Search failed', 'INTERNAL_ERROR', 500);
  }
}
