export const siteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Livio Homes',
  tagline: process.env.NEXT_PUBLIC_COMPANY_TAGLINE || 'Home Services Done Right',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'liviohomes.ae',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@liviohomes.ae',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+971-XX-XXX-XXXX',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+971XXXXXXXXX',
  colors: {
    primary: '#1B3A5C',
    accent: '#2BA5B5',
  },
  vat: 5,
  currency: 'AED',
  orderPrefix: 'LH',
  invoicePrefix: 'INV',
} as const;
