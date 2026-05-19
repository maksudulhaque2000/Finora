import NewAssetPage from '@/app/(dashboard)/assets/new/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardNewAssetPage() {
  return (
    <DashboardRouteShell>
      <NewAssetPage />
    </DashboardRouteShell>
  );
}
