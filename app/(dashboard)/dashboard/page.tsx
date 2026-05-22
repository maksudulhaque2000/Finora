'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, isSameMonth, subMonths } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart
} from 'recharts';
import { Button } from '@/components/ui/button';
import { FinancialCard } from '@/components/financial-card';
import { ChartContainer } from '@/components/chart-container';
import { TransactionTable } from '@/components/transaction-table';
import { PageShell } from '@/components/page-shell';
import { EmptyState } from '@/components/empty-state';
import { PageSkeleton } from '@/components/page-skeleton';
import { Sparkles } from 'lucide-react';

type DashboardTransaction = {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string;
  category: string;
  date: string;
};

type DashboardState = {
  summary: { income: number; expenses: number; balance: number };
  balanceSheet: { assets: number; liabilities: number };
  transactions: DashboardTransaction[];
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search')?.trim() ?? '';
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const transactionUrl = new URL('/api/transactions', window.location.origin);
        transactionUrl.searchParams.set('pageSize', '500');

        if (searchTerm) {
          transactionUrl.searchParams.set('search', searchTerm);
        }

        const [summaryResponse, balanceSheetResponse, transactionsResponse] = await Promise.all([
          fetch('/api/reports/summary'),
          fetch('/api/reports/balance-sheet'),
          fetch(transactionUrl.toString())
        ]);

        const [summaryPayload, balanceSheetPayload, transactionsPayload] = await Promise.all([
          summaryResponse.json().catch(() => null),
          balanceSheetResponse.json().catch(() => null),
          transactionsResponse.json().catch(() => null)
        ]);

        if (!summaryResponse.ok) throw new Error(summaryPayload?.error ?? 'Failed to load dashboard summary.');
        if (!balanceSheetResponse.ok) throw new Error(balanceSheetPayload?.error ?? 'Failed to load dashboard balance sheet.');
        if (!transactionsResponse.ok) throw new Error(transactionsPayload?.error ?? 'Failed to load dashboard transactions.');

        if (!active) {
          return;
        }

        const transactionsList = (transactionsPayload.data ?? transactionsPayload ?? []).map((transaction: { id: string; type: 'INCOME' | 'EXPENSE' | 'TRANSFER'; amount: number; description: string; date: string; category?: { name?: string } | null }) => ({
          id: transaction.id,
          type: transaction.type,
          amount: Number(transaction.amount),
          description: transaction.description,
          category: transaction.category?.name ?? 'Uncategorized',
          date: transaction.date
        }));

        setData({
          summary: summaryPayload.data ?? summaryPayload,
          balanceSheet: balanceSheetPayload.data ?? balanceSheetPayload,
          transactions: transactionsList
        });

        // eslint-disable-next-line no-console
        console.log('Dashboard data loaded:', {
          transactionCount: transactionsList.length,
          incomeCount: transactionsList.filter((t: DashboardTransaction) => t.type === 'INCOME').length,
          expenseCount: transactionsList.filter((t: DashboardTransaction) => t.type === 'EXPENSE').length,
          totalIncome: transactionsList.filter((t: DashboardTransaction) => t.type === 'INCOME').reduce((sum: number, t: DashboardTransaction) => sum + t.amount, 0),
          totalExpense: transactionsList.filter((t: DashboardTransaction) => t.type === 'EXPENSE').reduce((sum: number, t: DashboardTransaction) => sum + t.amount, 0),
          summary: summaryPayload.data ?? summaryPayload,
          balanceSheet: balanceSheetPayload.data ?? balanceSheetPayload
        });
      } catch (dashboardError) {
        if (!active) {
          return;
        }

        const message = dashboardError instanceof Error ? dashboardError.message : 'Dashboard data could not be loaded.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('Dashboard load failed', dashboardError);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [searchTerm]);

  const chartAnchorDate = useMemo(() => {
    const dates = (data?.transactions ?? []).map((transaction) => new Date(transaction.date).getTime()).filter((date) => !Number.isNaN(date));
    if (dates.length === 0) {
      return new Date();
    }

    return new Date(Math.max(...dates));
  }, [data]);

  const monthKeys = useMemo(
    () => Array.from({ length: 6 }, (_, index) => subMonths(chartAnchorDate, 5 - index)),
    [chartAnchorDate]
  );

  const monthlyData = useMemo(() => {
    const byMonth = new Map<string, { month: string; income: number; expense: number; balance: number }>();

    for (const monthDate of monthKeys) {
      const key = format(monthDate, 'yyyy-MM');
      byMonth.set(key, { month: format(monthDate, 'MMM'), income: 0, expense: 0, balance: 0 });
    }

    // Sort transactions by date and calculate cumulative balance from ALL transactions
    const sortedTransactions = [...(data?.transactions ?? [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeBalance = 0;

    // First pass: calculate cumulative balance up to the start of our chart window
    const chartStartDate = monthKeys.length > 0 ? monthKeys[0] : new Date();
    for (const transaction of sortedTransactions) {
      const transactionDate = new Date(transaction.date);

      if (transactionDate < chartStartDate) {
        // These transactions happened before our chart window, but affect the cumulative balance
        if (transaction.type === 'INCOME') {
          cumulativeBalance += transaction.amount;
        } else if (transaction.type === 'EXPENSE') {
          cumulativeBalance -= transaction.amount;
        }
      }
    }

    // Second pass: process transactions within our chart window
    for (const transaction of sortedTransactions) {
      const transactionDate = new Date(transaction.date);
      const key = format(transactionDate, 'yyyy-MM');
      const bucket = byMonth.get(key);

      // Only process transactions within our chart window
      if (!bucket) {
        continue;
      }

      if (transaction.type === 'INCOME') {
        bucket.income += transaction.amount;
        cumulativeBalance += transaction.amount;
      } else if (transaction.type === 'EXPENSE') {
        bucket.expense += transaction.amount;
        cumulativeBalance -= transaction.amount;
      }

      bucket.balance = cumulativeBalance;
    }

    return Array.from(byMonth.values());
  }, [data, monthKeys]);

  const expenseBreakdown = useMemo(() => {
    const map = new Map<string, number>();

    for (const transaction of data?.transactions ?? []) {
      if (transaction.type !== 'EXPENSE') {
        continue;
      }

      map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
    }

    const total = Array.from(map.values()).reduce((sum, amount) => sum + amount, 0) || 1;
    const palette = ['#d4a853', '#58a6ff', '#2ecc71', '#e74c3c', '#f0c96b', '#9b59b6', '#1abc9c', '#f39c12'];

    return Array.from(map.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([name, amount], index) => ({
        name,
        value: Math.round((amount / total) * 100),
        color: palette[index % palette.length]
      }));
  }, [data]);

  const recentTransactions = useMemo(() => (data?.transactions ?? []).slice(0, 4), [data]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return (data?.transactions ?? []).filter((transaction) => {
      const txDate = new Date(transaction.date);
      return isSameMonth(txDate, now);
    });
  }, [data]);

  const income = data?.summary.income ?? 0;
  const expenses = data?.summary.expenses ?? 0;
  const balance = data?.summary.balance ?? 0;
  const assetValue = data?.balanceSheet.assets ?? 0;

  const topExpenseCategory = useMemo(() => {
    const map = new Map<string, number>();

    for (const transaction of currentMonthTransactions) {
      if (transaction.type !== 'EXPENSE') {
        continue;
      }

      map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
    }

    return Array.from(map.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'No expense data yet';
  }, [currentMonthTransactions]);

  const largestRecentExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === 'EXPENSE')
      .sort((left, right) => right.amount - left.amount)[0]?.description ?? 'No expense data yet';
  }, [currentMonthTransactions]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <PageShell
      title="Dashboard"
      description="Track monthly performance, balances, and financial health in one calm, fast, and responsive interface."
      actions={
        <>
          <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href="/reports">Export summary</Link>
          </Button>
          <Button asChild className="bg-gold text-black hover:bg-gold-light">
            <Link href="/dashboard/income#income-form">
              <Sparkles className="h-4 w-4" />
              New transaction
            </Link>
          </Button>
        </>
      }
    >
      {error ? <p className="rounded-2xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">{error}</p> : null}
      {searchTerm ? (
        <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          Showing transaction results for “{searchTerm}”.
        </div>
      ) : null}

      {!data ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/60">No dashboard data available. Add income or expenses to get started.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <FinancialCard title="Total income" amount={income} trend={data ? 'Live' : undefined} trendLabel="All time" tone="positive" />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <FinancialCard title="Total expenses" amount={expenses} trend={data ? 'Live' : undefined} trendLabel="All time" tone="negative" />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <FinancialCard title="Net balance" amount={balance} trend={data ? 'Live' : undefined} trendLabel="All time" tone="positive" />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <FinancialCard title="Asset value" amount={assetValue} trend={data ? 'Live' : undefined} trendLabel="Latest snapshot" tone="neutral" />
            </motion.div>
          </div>

          {(data?.transactions ?? []).length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60">No transactions yet. Start by adding income, expenses, or assets.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                <ChartContainer title="Monthly income vs expenses">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                        <YAxis stroke="rgba(255,255,255,0.35)" />
                        <Tooltip contentStyle={{ background: 'rgba(10, 14, 24, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Bar dataKey="income" fill="#d4a853" radius={[12, 12, 0, 0]} />
                        <Bar dataKey="expense" fill="#e74c3c" radius={[12, 12, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>

                {expenseBreakdown.length > 0 ? (
                  <ChartContainer title="Expense breakdown">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                            {expenseBreakdown.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(10, 14, 24, 0.95)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.92)'
                            }}
                            labelStyle={{ color: 'rgba(255,255,255,0.92)' }}
                            itemStyle={{ color: 'rgba(255,255,255,0.86)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartContainer>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                    <p className="text-white/60">No expense data to display</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <ChartContainer title="Balance trend">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                        <YAxis stroke="rgba(255,255,255,0.35)" />
                        <Tooltip contentStyle={{ background: 'rgba(10, 14, 24, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Area type="monotone" dataKey="balance" stroke="#58a6ff" fill="rgba(88,166,255,0.20)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>

                <ChartContainer title="Savings movement">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                        <YAxis stroke="rgba(255,255,255,0.35)" />
                        <Tooltip contentStyle={{ background: 'rgba(10, 14, 24, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Line type="monotone" dataKey="balance" stroke="#2ecc71" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <TransactionTable title="Recent transactions" rows={recentTransactions} />
                <EmptyState
                  title="Quick insights"
                  description={`Largest expense this month: ${largestRecentExpense}. Top spending category: ${topExpenseCategory}. Total transactions: ${data.transactions.length}.`}
                  iconName="Sparkles"
                />
              </div>
            </>
          )}
        </>
      )}
    </PageShell>
  );
}