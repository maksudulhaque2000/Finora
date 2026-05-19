import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  ShieldAlert,
  PieChart,
  Shapes,
  Settings,
  Sparkles
} from 'lucide-react';

export const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/income', label: 'Income', icon: ArrowUpCircle },
  { href: '/dashboard/expenses', label: 'Expenses', icon: ArrowDownCircle },
  { href: '/dashboard/assets', label: 'Assets', icon: Landmark },
  { href: '/dashboard/liabilities', label: 'Liabilities', icon: ShieldAlert },
  { href: '/dashboard/reports', label: 'Reports', icon: PieChart },
  { href: '/dashboard/categories', label: 'Categories', icon: Shapes },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/', label: 'Landing page', icon: Sparkles }
];