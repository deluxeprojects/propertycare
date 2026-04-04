export const siteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'ProKeep',
  tagline: process.env.NEXT_PUBLIC_COMPANY_TAGLINE || 'We Handle It.',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'prokeep.ae',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@prokeep.ae',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+971-XX-XXX-XXXX',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+971XXXXXXXXX',
  colors: {
    primary: '#1A1A1A',
    accent: '#4ECDC4',
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://instagram.com/prokeep.ae',
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://facebook.com/prokeep.ae',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://linkedin.com/company/prokeep-ae',
    x: process.env.NEXT_PUBLIC_SOCIAL_X || 'https://x.com/prokeep_ae',
  },
  vat: 5,
  currency: 'AED',
  orderPrefix: 'PK',
  invoicePrefix: 'INV',
} as const;
