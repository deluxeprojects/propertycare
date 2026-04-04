import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

interface AreaRow {
  id: string;
  name_en: string;
  description_en: string | null;
  is_active: boolean;
}

interface BuildingRow {
  id: string;
  name_en: string;
  slug: string;
  is_active: boolean;
  area_id: string;
  areas: { name_en: string }[];
}

interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default async function ContentPage() {
  const supabase = createAdminClient();

  // Area pages
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name_en, description_en, is_active')
    .is('deleted_at', null)
    .order('name_en', { ascending: true });

  const areaList = (areas ?? []).map((a: AreaRow) => {
    const desc = a.description_en ?? '';
    const wordCount = desc.trim() ? Math.round(desc.trim().length / 5) : 0;
    return {
      id: a.id,
      area: a.name_en,
      words: wordCount,
      status: a.is_active ? 'published' : 'draft',
    };
  });

  // Building pages
  const { data: buildings } = await supabase
    .from('buildings')
    .select('id, name_en, slug, is_active, area_id, areas!buildings_area_id_fkey(name_en)')
    .is('deleted_at', null)
    .order('name_en', { ascending: true })
    .limit(50);
  const buildingList = buildings ?? [];

  // Blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, published_at, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);
  const blogPosts = posts ?? [];

  // SEO stats
  const [
    { count: areasCount },
    { count: buildingsCount },
    { count: blogCount },
    { count: servicesCount },
  ] = await Promise.all([
    supabase.from('areas').select('*', { count: 'exact', head: true }).eq('is_active', true).is('deleted_at', null),
    supabase.from('buildings').select('*', { count: 'exact', head: true }).eq('is_active', true).is('deleted_at', null),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true).is('deleted_at', null),
  ]);
  const seoStats = {
    totalAreas: areasCount ?? 0,
    totalBuildings: buildingsCount ?? 0,
    totalBlogPosts: blogCount ?? 0,
    totalServices: servicesCount ?? 0,
  };

  const areaPagesTab = (
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
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No area pages found</td>
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
  );

  const buildingPagesTab = (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Building</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Area</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {buildingList.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No building pages found</td>
            </tr>
          )}
          {buildingList.map((b: BuildingRow) => (
            <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-foreground">{b.name_en}</td>
              <td className="px-4 py-3 text-muted-foreground">{b.slug}</td>
              <td className="px-4 py-3 text-foreground">{b.areas?.[0]?.name_en ?? '—'}</td>
              <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${b.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {b.is_active ? 'published' : 'draft'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const blogPostsTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{blogPosts.length} posts</p>
        <Link
          href="/admin/content/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
        >
          + New Post
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Published</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No blog posts found</td>
              </tr>
            )}
            {blogPosts.map((post: BlogPostRow) => (
              <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/admin/content/blog/${post.id}/edit`} className="text-accent hover:underline">{post.title}</Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{post.slug}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const seoHealthTab = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Area Pages</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{seoStats.totalAreas}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Building Pages</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{seoStats.totalBuildings}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published Blog Posts</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{seoStats.totalBlogPosts}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Services</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{seoStats.totalServices}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-2 font-semibold text-foreground">Sitemap Overview</h3>
        <p className="text-sm text-muted-foreground">
          Estimated total pages in sitemap: {seoStats.totalAreas + seoStats.totalBuildings + seoStats.totalBlogPosts + seoStats.totalServices + 5} (includes static pages)
        </p>
      </div>
    </div>
  );

  const aiPipelineTab = (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">AI Content Pipeline</h3>
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">n8n workflow integration</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your n8n instance to automate content generation for area and building pages.
          Configure the webhook URL in Settings &gt; Integrations.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="text-muted-foreground">Not connected</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content & SEO</h1>
        <p className="text-sm text-muted-foreground">Manage area pages, building pages, and blog content</p>
      </div>

      <AdminTabs tabs={[
        { label: 'Area Pages', content: areaPagesTab },
        { label: 'Building Pages', content: buildingPagesTab },
        { label: 'Blog Posts', content: blogPostsTab },
        { label: 'SEO Health', content: seoHealthTab },
        { label: 'AI Pipeline', content: aiPipelineTab },
      ]} />
    </div>
  );
}
