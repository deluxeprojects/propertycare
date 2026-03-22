import { createAdminClient } from '@/lib/supabase/admin';

export default async function ContentPage() {
  const supabase = createAdminClient();

  const { data: areas } = await supabase
    .from('areas')
    .select(`
      id,
      name_en,
      description_en,
      is_active
    `)
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const areaList = (areas ?? []).map((a: any) => {
    const desc = a.description_en ?? '';
    const wordCount = desc.trim() ? Math.round(desc.trim().length / 5) : 0;
    return {
      id: a.id,
      area: a.name_en,
      words: wordCount,
      status: a.is_active ? 'published' : 'draft',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content & SEO</h1>
        <p className="text-sm text-muted-foreground">Manage area pages, building pages, and blog content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {['Area Pages', 'Building Pages', 'Blog Posts', 'SEO Health', 'AI Pipeline'].map((tab, i) => (
          <button key={tab} className={`rounded-md px-4 py-2 text-sm font-medium ${i === 0 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Words</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Traffic (30d)</th>
            </tr>
          </thead>
          <tbody>
            {areaList.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No area pages found
                </td>
              </tr>
            )}
            {areaList.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{p.area}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{p.words}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-foreground">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
