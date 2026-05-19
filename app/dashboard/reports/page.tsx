import ReportsPage from '@/app/(dashboard)/reports/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardReportsPage() {
  return (
    <DashboardRouteShell>
      <ReportsPage />
    </DashboardRouteShell>
  );
}
