import IncomePage from '@/app/(dashboard)/income/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardIncomePage() {
  return (
    <DashboardRouteShell>
      <IncomePage />
    </DashboardRouteShell>
  );
}
