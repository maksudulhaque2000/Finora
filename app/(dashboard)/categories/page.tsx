import Link from 'next/link';
import { Shapes, Plus } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import AmountDynamic from '@/components/amount-dynamic';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/category-badge';

import { prisma } from '@/lib/prisma';
import { getWorkspace } from '@/lib/workspace';

export default async function CategoriesPage({ searchParams }: { searchParams?: { search?: string | string[] } }) {
  const { organization } = await getWorkspace();
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search.trim() : '';
  const matchesSearch = Boolean(searchTerm);

  const categoryWhere = matchesSearch
    ? {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' as const } },
          { icon: { contains: searchTerm, mode: 'insensitive' as const } }
        ]
      }
    : {};

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      where: {
        organizationId: organization.id,
        ...categoryWhere
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.transaction.findMany({
      where: {
        organizationId: organization.id,
        ...(matchesSearch
          ? {
              category: {
                is: {
                  OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' as const } },
                    { icon: { contains: searchTerm, mode: 'insensitive' as const } }
                  ]
                }
              }
            }
          : {})
      },
      include: { category: true },
      orderBy: { date: 'desc' }
    })
  ]);

  const categoryTotals = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const key = transaction.category?.id ?? transaction.categoryId;
    accumulator[key] = (accumulator[key] ?? 0) + Number(transaction.amount);
    return accumulator;
  }, {});

  return (
    <PageShell
      title="Categories"
      description="Create and organize income and expense categories with color-coded clarity and category totals."
      actions={
        <Button asChild className="bg-gold text-black hover:bg-gold-light">
          <Link href="/dashboard/categories/new">
            <Plus className="h-4 w-4" />
            New category
          </Link>
        </Button>
      }
    >
      {searchTerm ? (
        <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          Showing category matches for “{searchTerm}”.
        </div>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-white">Category registry</h3>
          <div className="mt-4 space-y-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <CategoryBadge name={category.name} color={category.color} />
                    <span className="text-sm text-white/50">{category.type}</span>
                  </div>
                  <span className="text-right block">
                    <AmountDynamic value={categoryTotals[category.id] ?? 0} baseRem={1.05} />
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center text-sm text-white/55">
                {searchTerm ? 'No categories matched the current search.' : 'No categories have been created yet.'}
              </div>
            )}
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