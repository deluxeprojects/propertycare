'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';

const RichTextEditor = dynamic(
  () => import('@/features/admin/components/RichTextEditor').then((mod) => mod.RichTextEditor),
  {
    loading: () => <div className="h-[500px] w-full animate-pulse rounded-lg bg-muted" />,
    ssr: false,
  }
);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: string | null;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setPost(null);
      } else {
        setPost(data);
        setTitle(data.title ?? '');
        setSlug(data.slug ?? '');
        setContent(data.content ?? '');
        setMetaTitle(data.meta_title ?? '');
        setMetaDesc(data.meta_description ?? '');
        setStatus(data.status ?? 'draft');
      }
      setLoading(false);
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setApiError('');

    const { error } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        content,
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        status,
        published_at: status === 'published' && !post?.published_at ? new Date().toISOString() : post?.published_at,
      })
      .eq('id', id);

    if (error) {
      setApiError(`Failed to save: ${error.message}`);
    } else {
      setSaved(true);
    }
    setSaving(false);
  };

  const handleUnpublish = async () => {
    setStatus('draft');
    const { error } = await supabase
      .from('blog_posts')
      .update({ status: 'draft' })
      .eq('id', id);
    if (!error) {
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/content" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">The blog post with ID &quot;{id}&quot; could not be found.</p>
          <Link href="/admin/content" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
            Back to Content
          </Link>
        </div>
      </div>
    );
  }

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

      {apiError && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{apiError}</p>
        </div>
      )}

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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Post'}
              </button>
              {post.status === 'published' && (
                <button
                  onClick={handleUnpublish}
                  className="w-full rounded-lg border border-destructive py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Unpublish
                </button>
              )}
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
