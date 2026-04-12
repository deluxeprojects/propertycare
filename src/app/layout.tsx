import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { siteConfig } from '@/config/site';
import { Toaster } from 'sonner';
import { ReportWidget } from '@/components/shared/report-widget';
import { generateLocalBusinessSchema } from '@/lib/utils/seo';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} — Professional home services in Dubai. Cleaning, AC, pest control, plumbing, electrical, painting & maintenance. Book online in 60 seconds.`,
  metadataBase: new URL(`https://${siteConfig.domain}`),
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Professional home services in Dubai. 53+ services across 40+ areas.',
    images: [
      {
        url: `https://${siteConfig.domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Professional Home Services in Dubai`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Professional home services in Dubai.',
    images: [`https://${siteConfig.domain}/og-image.png`],
  },
  alternates: {
    canonical: `https://${siteConfig.domain}`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema()),
          }}
        />
        {gtmId && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
        <ReportWidget />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
