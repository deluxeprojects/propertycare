'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/features/admin/components/RichTextEditor').then((mod) => mod.RichTextEditor),
  {
    loading: () => <div className="h-[500px] w-full animate-pulse rounded-lg bg-muted" />,
    ssr: false,
  }
);
import { siteConfig } from '@/config/site';

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('General Tips');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [status, setStatus] = useState('draft');
  const [publishDate, setPublishDate] = useState('');
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
    // TODO: Save to Supabase blog table (not yet created)
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Blog Post Saved</h2>
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
          <h1 className="text-2xl font-bold text-foreground">New Blog Post</h1>
          <p className="text-sm text-muted-foreground">Create content for {siteConfig.name} blog</p>
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
                  placeholder="e.g. The Complete Guide to AC Maintenance in Dubai"
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

          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for cards and search results (160 chars max)"
              rows={3}
              maxLength={160}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Publish Date</label>
                <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} placeholder="50-60 characters" className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Meta Description</label>
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} maxLength={160} rows={3} placeholder="140-160 characters" className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Category</h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
              <option>Cleaning</option>
              <option>AC Services</option>
              <option>Pest Control</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Painting</option>
              <option>General Tips</option>
              <option>Dubai Living</option>
            </select>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold text-foreground">Featured Image</h3>
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground">Drop image or click to upload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
