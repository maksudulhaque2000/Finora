import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export async function DashboardRouteShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
