import { Suspense } from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminTabs } from '@/features/admin/components/AdminTabs';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab ?? 'area-pages';

  const supabase = createAdminClient();

  // Area pages
  let areaList: { id: string; area: string; words: number; status: string }[] = [];
  if (activeTab === 'area-pages') {
    const { data: areas } = await supabase
      .from('areas')
      .select('id, name_en, description_en, is_active')
      .is('deleted_at', null)
      .order('name_en', { ascending: true });

    areaList = (areas ?? []).map((a: any) => {
      const desc = a.description_en ?? '';
      const wordCount = desc.trim() ? Math.round(desc.trim().length / 5) : 0;
      return {
        id: a.id,
        area: a.name_en,
        words: wordCount,
        status: a.is_active ? 'published' : 'draft',
      };
    });
  }

  // Building pages
  let buildingList: any[] = [];
  if (activeTab === 'building-pages') {
    const { data: buildings } = await supabase
      .from('buildings')
      .select('id, name_en, slug, is_active, area_id, areas!buildings_area_id_fkey(name_en)')
      .is('deleted_at', null)
      .order('name_en', { ascending: true })
      .limit(50);
    buildingList = buildings ?? [];
  }

  // Blog posts
  let blogPosts: any[] = [];
  if (activeTab === 'blog-posts') {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, published_at, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);
    blogPosts = posts ?? [];
  }

  // SEO stats
  let seoStats = { totalAreas: 0, totalBuildings: 0, totalBlogPosts: 0, totalServices: 0 };
  if (activeTab === 'seo-health') {
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
    seoStats = {
      totalAreas: areasCount ?? 0,
      totalBuildings: buildingsCount ?? 0,
      totalBlogPosts: blogCount ?? 0,
      totalServices: servicesCount ?? 0,
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content & SEO</h1>
        <p className="text-sm text-muted-foreground">Manage area pages, building pages, and blog content</p>
      </div>

      <Suspense>
        <AdminTabs tabs={['Area Pages', 'Building Pages', 'Blog Posts', 'SEO Health', 'AI Pipeline']} />
      </Suspense>

      {activeTab === 'area-pages' && (
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
      )}

      {activeTab === 'building-pages' && (
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
              {buildingList.map((b: any) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{b.name_en}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.slug}</td>
                  <td className="px-4 py-3 text-foreground">{b.areas?.name_en ?? '—'}</td>
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
      )}

      {activeTab === 'blog-posts' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link
              href="/admin/content/blog/new"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
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
                {blogPosts.map((post: any) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
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
      )}

      {activeTab === 'seo-health' && (
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
      )}

      {activeTab === 'ai-pipeline' && (
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
      )}
    </div>
  );
}
