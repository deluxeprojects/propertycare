export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  roles?: string[];
}

export const customerNav: NavItem[] = [
  { label: 'Services', href: '/home-services' },
  { label: 'Areas', href: '/areas' },
  { label: 'Guardian', href: '/home-services/guardian' },
  { label: 'Care Plans', href: '/care-plans' },
  { label: 'Blog', href: '/blog' },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Orders', href: '/admin/orders', icon: 'ClipboardList' },
  { label: 'Services', href: '/admin/services', icon: 'Wrench' },
  { label: 'Pricing', href: '/admin/pricing', icon: 'DollarSign' },
  { label: 'Promotions', href: '/admin/promos', icon: 'Tag' },
  { label: 'Customers', href: '/admin/customers', icon: 'Users' },
  { label: 'Workforce', href: '/admin/workforce', icon: 'HardHat' },
  { label: 'Care Plans', href: '/admin/care-plans', icon: 'Shield' },
  { label: 'Content', href: '/admin/content', icon: 'FileText' },
  { label: 'Financials', href: '/admin/financials', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings', roles: ['super_admin'] },
];

export const staffNav: NavItem[] = [
  { label: 'My Tasks', href: '/staff', icon: 'CheckSquare' },
  { label: 'Schedule', href: '/staff/schedule', icon: 'Calendar' },
  { label: 'Profile', href: '/staff/profile', icon: 'User' },
];
