import ExpensesPage from '@/app/(dashboard)/expenses/page';
import { DashboardRouteShell } from '@/components/dashboard-route-shell';

export default async function DashboardExpensesPage() {
  return (
    <DashboardRouteShell>
      <ExpensesPage />
    </DashboardRouteShell>
  );
}
