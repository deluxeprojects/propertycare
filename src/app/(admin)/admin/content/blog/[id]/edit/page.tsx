'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { RichTextEditor } from '@/features/admin/components/RichTextEditor';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('The Complete Guide to AC Maintenance in Dubai');
  const [slug, setSlug] = useState('complete-guide-ac-maintenance-dubai');
  const [content, setContent] = useState("Dubai's extreme climate makes air conditioning not just a luxury but a necessity...");
  const [metaTitle, setMetaTitle] = useState('Complete Guide to AC Maintenance in Dubai');
  const [metaDesc, setMetaDesc] = useState('Learn why regular AC servicing is essential in Dubai...');
  const [status, setStatus] = useState('Published');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!slug.trim()) e.slug = 'Slug is required';
    if (!content.trim()) e.content = 'Content is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    // TODO: Update in Supabase blog table
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
  };

  const handleUnpublish = () => {
    setStatus('Draft');
  };

  if (saved) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Blog Post Updated</h2>
          <Link href="/admin/content" className="text-sm text-accent hover:underline">Back to Content</Link>
        </div>
      </div>
    );
  }

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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-lg font-semibold focus:outline-none ${errors.title ? 'border-destructive' : 'border-input focus:border-accent'}`}
                />
                {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Slug</label>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none ${errors.slug ? 'border-destructive' : 'border-input focus:border-accent'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-3 block text-sm font-medium text-foreground">Content *</label>
            <RichTextEditor value={content} onChange={setContent} height={500} />
            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Scheduled</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>
              <button
                onClick={handleUnpublish}
                className="w-full rounded-lg border border-destructive py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                Unpublish
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description</label>
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} maxLength={160} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
