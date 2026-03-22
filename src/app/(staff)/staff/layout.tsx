import { StaffShell } from '@/features/staff/components/StaffShell';

export const metadata = { title: 'Staff Portal' };

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>;
}
