import { CustomerShell } from '@/features/customer/components/CustomerShell';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerShell>{children}</CustomerShell>;
}
