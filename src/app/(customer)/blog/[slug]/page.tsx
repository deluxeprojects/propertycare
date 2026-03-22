import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Revalidate every hour

async function getBlogPost(slug: string) {
  const supabase = createAdminClient();
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) return null;
  return post;
}

async function getRelatedPosts(category: string, slug: string) {
  const supabase = createAdminClient();
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, featured_image, category, published_at')
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', slug)
    .limit(3);

  return relatedPosts || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Blog Post' };

  const pageTitle = (post.meta_title || post.title).replace(/\s*\|\s*ProKeep\s*$/i, '');
  return {
    title: pageTitle,
    description: post.meta_description || post.excerpt || post.content.substring(0, 155) + '...',
    openGraph: {
      title: pageTitle,
      description: post.meta_description || post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author || 'ProKeep Team'],
      ...(post.featured_image ? { images: [{ url: post.featured_image }] } : {}),
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderContent(content: string) {
  const blocks = content.split('\n\n');

  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-8 text-2xl font-bold text-foreground">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="mt-6 text-xl font-semibold text-foreground">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
      const items = trimmed.split('\n').filter(Boolean);
      const isOrdered = trimmed.startsWith('1. ');
      const ListTag = isOrdered ? 'ol' : 'ul';
      return (
        <ListTag
          key={i}
          className={`${isOrdered ? 'list-decimal' : 'list-disc'} space-y-1 pl-6 text-muted-foreground`}
        >
          {items.map((item, j) => {
            const cleanItem = item.replace(/^[-\d.]+\s*/, '');
            return (
              <li key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cleanItem) }} />
            );
          })}
        </ListTag>
      );
    }

    return (
      <p
        key={i}
        className="text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed) }}
      />
    );
  });
}

function renderInlineMarkdown(text: string): string {
  // Bold
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Internal links
  result = result.replace(
    /\[([^\]]+)\]\((\/[^)]+)\)/g,
    '<a href="$2" class="text-accent hover:underline">$1</a>'
  );
  // External links
  result = result.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return result;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.category, slug);

  return (
    <div className="px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: { '@type': 'Organization', name: siteConfig.name },
            publisher: { '@type': 'Organization', name: siteConfig.name },
          }),
        }}
      />
      <div className="container mx-auto max-w-3xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>{' / '}
          <Link href="/blog" className="hover:text-accent">Blog</Link>{' / '}
          <span className="text-foreground">{post.title}</span>
        </nav>

        <article>
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
              {post.read_time && (
                <span className="text-xs text-muted-foreground">{post.read_time}</span>
              )}
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{post.title}</h1>
            <p className="text-sm text-muted-foreground">By {post.author || siteConfig.name + ' Team'}</p>
          </div>

          {post.featured_image && (
            <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-xl">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none space-y-4 text-foreground">
            {renderContent(post.content)}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-muted p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Need This Service?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Book professional {post.category.toLowerCase()} with {siteConfig.name}
          </p>
          <Link
            href="/book"
            className="inline-flex rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Book Now
          </Link>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent hover:shadow-md"
                >
                  {related.featured_image && (
                    <div className="relative h-36 w-full">
                      <Image
                        src={related.featured_image}
                        alt={related.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="mb-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {related.category}
                    </span>
                    <h3 className="mb-1 text-sm font-semibold text-foreground group-hover:text-accent line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
