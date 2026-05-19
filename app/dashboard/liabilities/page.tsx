import LiabilitiesPage from '@/app/(dashboard)/liabilities/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardLiabilitiesPage() {
  return (
    <DashboardRouteShell>
      <LiabilitiesPage />
    </DashboardRouteShell>
  );
}
