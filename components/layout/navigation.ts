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
  { href: '/income', label: 'Income', icon: ArrowUpCircle },
  { href: '/expenses', label: 'Expenses', icon: ArrowDownCircle },
  { href: '/assets', label: 'Assets', icon: Landmark },
  { href: '/liabilities', label: 'Liabilities', icon: ShieldAlert },
  { href: '/reports', label: 'Reports', icon: PieChart },
  { href: '/categories', label: 'Categories', icon: Shapes },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/', label: 'Landing page', icon: Sparkles }
];