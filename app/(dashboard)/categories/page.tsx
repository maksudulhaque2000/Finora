import { Shapes, Plus } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/category-badge';

const categories = [
  { name: 'Salary', type: 'INCOME', color: '#2ecc71', total: 86000 },
  { name: 'Business', type: 'INCOME', color: '#58a6ff', total: 45000 },
  { name: 'Rent', type: 'EXPENSE', color: '#d4a853', total: 12800 },
  { name: 'Operations', type: 'EXPENSE', color: '#e74c3c', total: 6400 }
];

export default function CategoriesPage() {
  return (
    <PageShell
      title="Categories"
      description="Create and organize income and expense categories with color-coded clarity and category totals."
      actions={
        <Button className="bg-gold text-black hover:bg-gold-light">
          <Plus className="h-4 w-4" />
          New category
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Category registry</h3>
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge name={category.name} color={category.color} />
                  <span className="text-sm text-white/50">{category.type}</span>
                </div>
                <span className="font-mono text-white">BDT {category.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[28px] p-6">
          <Shapes className="h-6 w-6 text-gold-light" />
          <h3 className="mt-4 text-xl font-semibold text-white">Category design</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Category colors and icons make the tables, charts, and export layouts easier to scan, especially on smaller screens.
          </p>
        </div>
      </div>
    </PageShell>
  );
}