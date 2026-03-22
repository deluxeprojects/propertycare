import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const blogPosts: Record<string, { title: string; category: string; date: string; readTime: string; content: string }> = {
  'complete-guide-ac-maintenance-dubai': {
    title: 'The Complete Guide to AC Maintenance in Dubai',
    category: 'AC Services',
    date: '2026-03-15',
    readTime: '8 min read',
    content: `Dubai's extreme climate makes air conditioning not just a luxury but a necessity. With temperatures regularly exceeding 45°C in summer, your AC system works overtime to keep your home comfortable. Regular maintenance is essential to ensure efficiency, longevity, and air quality.

## Why Regular AC Maintenance Matters

A well-maintained AC unit uses 15-25% less energy than a neglected one. In Dubai, where AC can account for up to 60% of your electricity bill, that translates to significant savings — typically AED 200-500 per month for a 2-bedroom apartment.

## How Often Should You Service Your AC?

For Dubai residents, we recommend:
- **Standard service** every 3 months (4 times per year)
- **Deep cleaning** at least once per year, ideally before summer
- **Duct cleaning** every 2-3 years

## What Does a Professional AC Service Include?

1. **Filter cleaning/replacement** — Dirty filters restrict airflow and reduce efficiency
2. **Coil cleaning** — Dust and debris on evaporator and condenser coils reduce cooling capacity
3. **Drainage check** — Blocked drainage can cause water leaks and humidity issues
4. **Refrigerant level check** — Low refrigerant means poor cooling and higher energy consumption
5. **Thermostat calibration** — Ensures accurate temperature readings
6. **Electrical connections** — Loose connections can cause safety hazards

## Signs Your AC Needs Immediate Attention

- Unusual noises (grinding, squealing, or rattling)
- Weak airflow even at maximum settings
- Water leaking from the indoor unit
- Unpleasant odors when the AC is running
- AC cycling on and off frequently
- Electricity bills significantly higher than usual

## The Cost of Neglect

Ignoring AC maintenance can lead to:
- **Compressor failure** (AED 2,000-5,000 to replace)
- **Mold growth** in ducts (health hazard + AED 1,500-3,000 for remediation)
- **Complete system replacement** (AED 5,000-15,000 per unit)

## Save with an AMC Plan

Our Annual Maintenance Contracts include regular AC servicing as part of a comprehensive home maintenance package. Starting from just AED 79/month, you get scheduled maintenance, priority service, and discounts on additional work.`,
  },
  'deep-cleaning-checklist-dubai-apartments': {
    title: 'Deep Cleaning Checklist for Dubai Apartments',
    category: 'Cleaning',
    date: '2026-03-10',
    readTime: '6 min read',
    content: `Whether you're moving in, moving out, or just want a fresh start, a deep cleaning goes beyond regular tidying. Here's our comprehensive room-by-room checklist used by our professional cleaning teams.

## Kitchen
- Degrease and clean inside/outside of oven
- Clean inside of fridge and freezer
- Wipe down all cabinet fronts and handles
- Clean behind and under appliances
- Descale kettle, clean microwave inside
- Deep clean sink and faucets
- Clean range hood and filters
- Scrub tile grout and backsplash
- Clean inside of dishwasher

## Bathrooms
- Descale showerhead, taps, and glass
- Clean and disinfect toilet thoroughly
- Scrub tile grout
- Clean exhaust fan
- Wipe down all cabinets and mirrors
- Clean behind toilet and under sink

## Bedrooms
- Dust all surfaces including ceiling fans
- Clean inside wardrobes (empty ones)
- Vacuum and mop under beds and furniture
- Clean window sills and tracks
- Wipe down light switches and door handles

## Living Areas
- Dust all surfaces, shelves, and decor
- Clean all glass surfaces and mirrors
- Vacuum sofas (under cushions)
- Clean balcony floor and railings
- Wipe down all electrical outlets and switches

## General
- Clean all windows (inside)
- Clean all doors and door frames
- Dust and clean all light fixtures
- Clean air vents and returns
- Vacuum and mop all floors
- Clean baseboards

## Pro Tips
1. **Schedule before summer** — Deep clean before closing up for travel
2. **Combine with pest control** — Best done right after a deep clean
3. **Consider your AC** — Get AC serviced at the same time for best air quality`,
  },
  'pest-control-guide-uae': {
    title: 'Pest Control in UAE: What Every Homeowner Should Know',
    category: 'Pest Control',
    date: '2026-03-05',
    readTime: '7 min read',
    content: `Dubai's warm climate and rapid urbanization create ideal conditions for various pests. Understanding common pests and prevention methods can save you from costly infestations.

## Common Pests in Dubai

### Cockroaches
The most common household pest in the UAE. German cockroaches prefer kitchens and bathrooms, while American cockroaches are found in basements and outdoor areas.

### Bed Bugs
A growing problem in Dubai, especially in apartments with high tenant turnover. They travel through luggage, second-hand furniture, and shared walls.

### Ants
Several species thrive in Dubai, including fire ants in gardens and crazy ants that invade kitchens seeking moisture and food.

### Termites
A serious concern for villas and ground-floor apartments. Subterranean termites can cause severe structural damage before being detected.

### Rodents
Mice and rats are attracted to construction areas, food waste, and water sources. They pose health risks and can damage wiring.

## Prevention Tips

1. **Seal entry points** — Check windows, doors, pipes, and cable entry points
2. **Eliminate moisture** — Fix leaks, use dehumidifiers, ensure proper drainage
3. **Proper food storage** — Use airtight containers, clean up crumbs immediately
4. **Regular cleaning** — Pay attention to behind appliances and under sinks
5. **Waste management** — Use sealed bins, take out trash daily
6. **Landscaping** — Keep vegetation trimmed away from building walls

## When to Call a Professional

- Any sign of termites (mud tubes, hollow-sounding wood)
- Bed bug bites or sightings
- Recurring cockroach problems despite DIY treatment
- Rodent droppings or gnaw marks
- Before and after moving into a new property

## Dubai Municipality Requirements

All pest control services in Dubai must be approved by Dubai Municipality. Always verify that your provider holds a valid pest control license and uses approved chemicals.`,
  },
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return { title: 'Blog Post' };
  return {
    title: post.title,
    description: post.content.substring(0, 155) + '...',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) notFound();

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">{post.category}</span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{post.title}</h1>
            <p className="text-sm text-muted-foreground">By {siteConfig.name} Team</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-4 text-foreground">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="mt-8 text-2xl font-bold text-foreground">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={i} className="mt-6 text-xl font-semibold text-foreground">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="list-disc space-y-1 pl-6 text-muted-foreground">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^[-\d.]+\s*\*\*/, '').replace(/\*\*/g, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-muted p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Need This Service?</h3>
          <p className="mb-4 text-sm text-muted-foreground">Book professional {post.category.toLowerCase()} with {siteConfig.name}</p>
          <Link href="/book" className="inline-flex rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
