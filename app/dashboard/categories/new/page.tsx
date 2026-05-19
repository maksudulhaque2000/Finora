import NewCategoryPage from '@/app/(dashboard)/categories/new/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardNewCategoryPage() {
  return (
    <DashboardRouteShell>
      <NewCategoryPage />
    </DashboardRouteShell>
  );
}
