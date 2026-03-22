import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Blog',
  description: `Home maintenance tips, guides, and news from ${siteConfig.name}. Expert advice for Dubai homeowners.`,
};

const posts = [
  {
    slug: 'complete-guide-ac-maintenance-dubai',
    title: 'The Complete Guide to AC Maintenance in Dubai',
    excerpt: 'Learn why regular AC servicing is essential in Dubai\'s climate and how to keep your units running efficiently year-round.',
    date: '2026-03-15',
    category: 'AC Services',
    readTime: '8 min read',
  },
  {
    slug: 'deep-cleaning-checklist-dubai-apartments',
    title: 'Deep Cleaning Checklist for Dubai Apartments',
    excerpt: 'A room-by-room checklist for thorough deep cleaning. Perfect for move-in/out or seasonal cleaning.',
    date: '2026-03-10',
    category: 'Cleaning',
    readTime: '6 min read',
  },
  {
    slug: 'pest-control-guide-uae',
    title: 'Pest Control in UAE: What Every Homeowner Should Know',
    excerpt: 'Common pests in Dubai, prevention tips, and when to call a professional pest control service.',
    date: '2026-03-05',
    category: 'Pest Control',
    readTime: '7 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Blog</h1>
        <p className="mb-8 text-muted-foreground">Expert tips, guides, and news about home maintenance in Dubai.</p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{post.category}</span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
