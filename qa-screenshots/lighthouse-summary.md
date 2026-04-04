# Lighthouse Audit Summary - prokeep.ae

**Date:** 2026-04-04
**Tool:** Lighthouse CLI (headless Chrome 146.0.7680.153)
**Throttling:** Simulated (default Lighthouse mobile throttling)

---

## Category Scores

| Page | Performance | Accessibility | Best Practices | SEO |
|------|:-----------:|:-------------:|:--------------:|:---:|
| Homepage (`/`) | 87 | 91 | 96 | 100 |
| Home Services (`/home-services`) | 97 | 95 | 96 | 100 |
| Areas (`/areas`) | 99 | 96 | 96 | 100 |
| Blog (`/blog`) | 96 | 95 | 96 | 100 |
| Contact (`/contact`) | 99 | 95 | 96 | 100 |

---

## Core Web Vitals & Key Metrics

| Page | FCP | LCP | CLS | TTI | TBT |
|------|-----|-----|-----|-----|-----|
| Homepage (`/`) | 1.0 s | **4.1 s** | 0 | 4.1 s | 80 ms |
| Home Services (`/home-services`) | 0.9 s | 2.6 s | 0 | 2.7 s | 20 ms |
| Areas (`/areas`) | 0.9 s | 2.0 s | 0 | 2.0 s | 40 ms |
| Blog (`/blog`) | 0.9 s | 2.8 s | 0 | 2.8 s | 40 ms |
| Contact (`/contact`) | 0.9 s | 2.0 s | 0 | 2.0 s | 20 ms |

### Core Web Vitals Thresholds Reference
- **LCP:** Good < 2.5s | Needs Improvement 2.5-4.0s | Poor > 4.0s
- **CLS:** Good < 0.1 | Needs Improvement 0.1-0.25 | Poor > 0.25
- **FCP:** Good < 1.8s | Needs Improvement 1.8-3.0s | Poor > 3.0s

---

## Flagged Issues

### POOR: Homepage LCP = 4.1s (exceeds 4.0s threshold)
The homepage Largest Contentful Paint is in the **poor** range at 4.1 seconds. This is the only Core Web Vital across all 5 pages that falls into the poor category. The LCP element is likely the hero image or a large above-the-fold element. Recommended actions:
- Investigate the LCP element (likely hero image) and optimize its loading
- Consider preloading the LCP image with `<link rel="preload">`
- Ensure the hero image uses next-gen formats (WebP/AVIF) and appropriate sizing
- Check if any render-blocking resources are delaying the LCP

### NEEDS IMPROVEMENT: Homepage TTI = 4.1s
The Time to Interactive on the homepage is elevated compared to other pages, correlating with the high LCP.

### NEEDS IMPROVEMENT: Blog LCP = 2.8s
The blog page LCP of 2.8s falls in the "needs improvement" range (2.5-4.0s). Consider optimizing blog listing images.

### NEEDS IMPROVEMENT: Home Services LCP = 2.6s
Slightly above the 2.5s "good" threshold. Minor optimization could bring this into the green zone.

---

## Overall Assessment

**All category scores are above 80** -- no category-level flags. The site performs well across accessibility (91-96), best practices (96 across all pages), and SEO (perfect 100 across all pages).

The primary concern is the **homepage LCP of 4.1s**, which is the only metric in the "poor" range. All other pages have acceptable Core Web Vitals, with CLS at essentially zero across the board (excellent layout stability).

### Priority Action Items
1. **HIGH** - Fix homepage LCP (4.1s, poor) -- optimize hero/above-the-fold content loading
2. **LOW** - Optimize blog page LCP (2.8s, needs improvement)
3. **LOW** - Optimize home-services LCP (2.6s, needs improvement)

---

## JSON Reports
- `/qa-screenshots/lighthouse-homepage.json`
- `/qa-screenshots/lighthouse-home-services.json`
- `/qa-screenshots/lighthouse-areas.json`
- `/qa-screenshots/lighthouse-blog.json`
- `/qa-screenshots/lighthouse-contact.json`
