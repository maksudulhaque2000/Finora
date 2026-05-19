import NewLiabilityPage from '@/app/(dashboard)/liabilities/new/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardNewLiabilityPage() {
  return (
    <DashboardRouteShell>
      <NewLiabilityPage />
    </DashboardRouteShell>
  );
}
