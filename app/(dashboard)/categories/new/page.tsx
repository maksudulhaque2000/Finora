import { PageShell } from '@/components/page-shell';
import { CategoryForm } from '@/components/category-form';

export default function NewCategoryPage() {
  return (
    <PageShell title="New category" description="Create a reusable income or expense category for the current organization.">
      <CategoryForm />
    </PageShell>
  );
}
