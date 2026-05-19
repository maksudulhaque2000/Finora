import AssetsPage from '@/app/(dashboard)/assets/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardAssetsPage() {
  return (
    <DashboardRouteShell>
      <AssetsPage />
    </DashboardRouteShell>
  );
}
