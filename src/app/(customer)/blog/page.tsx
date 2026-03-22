import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = {
  title: 'Blog',
  description: `Home maintenance tips, guides, and news from ${siteConfig.name}. Expert advice for Dubai homeowners.`,
};

export const revalidate = 3600; // Revalidate every hour

async function getBlogPosts() {
  const supabase = createAdminClient();
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, category, featured_image, published_at, read_time, author')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return posts || [];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Blog</h1>
        <p className="mb-8 text-muted-foreground">Expert tips, guides, and news about home maintenance in Dubai.</p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  {post.featured_image && (
                    <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-48">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.published_at)}
                      </span>
                      {post.read_time && (
                        <span className="text-xs text-muted-foreground">{post.read_time}</span>
                      )}
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-foreground">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
