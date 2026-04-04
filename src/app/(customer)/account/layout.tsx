import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'View your orders, manage your profile, and access your ProKeep wallet.',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
