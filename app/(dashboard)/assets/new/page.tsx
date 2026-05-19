import { PageShell } from '@/components/page-shell';
import { AssetForm } from '@/components/asset-form';

export default function NewAssetPage() {
  return (
    <PageShell title="New asset" description="Record a tangible or liquid asset and keep the balance sheet current.">
      <AssetForm />
    </PageShell>
  );
}
