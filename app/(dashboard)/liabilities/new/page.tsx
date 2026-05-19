import { PageShell } from '@/components/page-shell';
import { LiabilityForm } from '@/components/liability-form';

export default function NewLiabilityPage() {
  return (
    <PageShell title="New liability" description="Register a loan, payable, or due item with balance and repayment context.">
      <LiabilityForm />
    </PageShell>
  );
}
