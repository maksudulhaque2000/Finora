import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}