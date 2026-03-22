import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Blog Post</h1>
          <p className="text-sm text-muted-foreground">Post ID: {id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
                <input type="text" defaultValue="The Complete Guide to AC Maintenance in Dubai" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-lg font-semibold focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Slug</label>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>/blog/</span>
                  <input type="text" defaultValue="complete-guide-ac-maintenance-dubai" className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:border-accent focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-3 block text-sm font-medium text-foreground">Content</label>
            <div className="mb-3 flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1">
              {['B', 'I', 'U', 'H1', 'H2', 'H3', '•', '1.', '"', 'Link', 'Image', 'Code'].map(btn => (
                <button key={btn} className="rounded px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground">
                  {btn}
                </button>
              ))}
            </div>
            <textarea
              defaultValue="Dubai's extreme climate makes air conditioning not just a luxury but a necessity..."
              rows={20}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select defaultValue="Published" className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Scheduled</option>
                </select>
              </div>
              <button className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
                Update Post
              </button>
              <button className="w-full rounded-lg border border-destructive py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                Unpublish
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Title</label>
                <input type="text" maxLength={60} defaultValue="Complete Guide to AC Maintenance in Dubai" className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description</label>
                <textarea maxLength={160} rows={3} defaultValue="Learn why regular AC servicing is essential in Dubai..." className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
