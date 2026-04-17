# ProKeep — Home Services Platform

**Live:** https://www.prokeep.ae

Professional home services platform connecting customers with technicians for on-demand and subscription-based maintenance in the UAE.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL, 23 migrations, RLS)
- **Styling:** Tailwind CSS 4, Radix UI, shadcn/ui
- **Payments:** Stripe (checkout + webhooks)
- **SMS:** Twilio
- **Email:** Resend
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Analytics:** GA4 + Google Tag Manager, Sentry
- **Testing:** Playwright + axe-core (accessibility)
- **Deployment:** Vercel (cron jobs for reminders/expiry)

## Features

### Customer Portal
- Browse 53+ services across 6 categories (Cleaning, AC, Pest Control, Plumbing, Electrical, Painting)
- Book services with dynamic price calculator (variants, addons, express surcharge)
- Multiple payment methods (Stripe card, Tabby, cash, bank transfer, wallet)
- Wallet system (referral credits, cashback)
- Order history, invoice downloads, reviews/ratings
- Guardian service (property monitoring)
- Care Plans (AMC subscriptions: Essential, Standard, Premium, VIP)

### Admin Dashboard
- Service management (CRUD, variants, addons, pricing rules)
- Order management (9 statuses: pending→completed/cancelled/refunded/disputed)
- Customer management (profiles, wallets, addresses)
- Technician workforce (scheduling, ratings, certifications, geo-tracking)
- Financial analytics (revenue by service, payroll, invoicing)
- Promotions (code-based discounts, referral tracking, usage limits)
- Blog/Content management (TinyMCE)
- Care plans management (4 AMC tiers, 9 unit types)
- System settings, audit logs, CSV exports

### Staff Portal
- Task assignment and scheduling
- Daily schedule management
- Order status updates from field

### Cron Jobs (Vercel)
- `expire-promos` — daily midnight
- `booking-reminders` — daily 9am (Twilio SMS)
- `amc-reminders` — daily 9am
- `review-requests` — hourly

## API Routes (34 endpoints)

```
/api/v1/public/    — services, pricing, search, AMC plans, promos, areas
/api/v1/customer/  — profile, addresses, orders, wallet, payments
/api/v1/staff/     — tasks, status updates
/api/v1/admin/     — services, orders, customers, workforce, blog, promos, financials, care-plans, exports
/api/cron/         — expire-promos, booking-reminders, amc-reminders, review-requests
/api/webhooks/     — stripe
```

## Database (23 migrations)

Core tables: `profiles`, `service_categories`, `services`, `service_variants`, `service_addons`, `areas`, `buildings`, `orders`, `order_addons`, `order_status_history`, `invoices`, `payments`, `technicians`, `technician_schedules`, `amc_plans`, `amc_plan_pricing`, `amc_subscriptions`, `customer_addresses`, `customer_wallets`, `wallet_transactions`, `promotions`, `promotion_usage`, `blog_posts`, `system_settings`, `audit_logs`, `bug_reports`

## Roles (6)

`super_admin`, `admin`, `manager`, `operator`, `technician`, `customer`

## Project Structure

```
src/
  app/
    (customer)/     Customer-facing pages
    (admin)/admin/  Admin dashboard
    (staff)/staff/  Staff portal
    api/v1/         RESTful API
  components/       Reusable UI components
  lib/
    api/            Error handling, auth checks
    validators/     Zod schemas
    stripe/         Stripe integration
    supabase/       DB client & queries
supabase/
  migrations/       23 SQL migration files
  seed.sql          6 categories, 53 services
```

## Setup

```bash
npm install
cp .env.example .env.local   # Fill in Supabase, Stripe, Twilio, Resend keys
npm run dev
```

## QA Status (Round 2 — April 2026)

- Build: 0 errors, 0 warnings
- Lighthouse: Avg 97/100 performance, 100/100 SEO
- Accessibility: 19 violations (0 critical)
- Links: 4,734 crawled, 0 broken
- API: 34 routes tested, all pass
