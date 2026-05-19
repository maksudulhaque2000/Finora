import SettingsPage from '@/app/(dashboard)/settings/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardSettingsPage() {
  return (
    <DashboardRouteShell>
      <SettingsPage />
    </DashboardRouteShell>
  );
}
