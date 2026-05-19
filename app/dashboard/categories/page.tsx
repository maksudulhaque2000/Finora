import CategoriesPage from '@/app/(dashboard)/categories/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardCategoriesPage() {
  return (
    <DashboardRouteShell>
      <CategoriesPage />
    </DashboardRouteShell>
  );
}
