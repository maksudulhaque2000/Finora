'use client';

import { motion } from 'framer-motion';
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
import { Sparkles } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', income: 240000, expense: 120000, balance: 120000 },
  { month: 'Feb', income: 290000, expense: 140000, balance: 150000 },
  { month: 'Mar', income: 265000, expense: 135000, balance: 130000 },
  { month: 'Apr', income: 320000, expense: 160000, balance: 160000 },
  { month: 'May', income: 345000, expense: 175000, balance: 170000 },
  { month: 'Jun', income: 380000, expense: 195000, balance: 185000 }
];

const expenseBreakdown = [
  { name: 'Operations', value: 38, color: '#d4a853' },
  { name: 'Payroll', value: 27, color: '#58a6ff' },
  { name: 'Logistics', value: 17, color: '#2ecc71' },
  { name: 'Other', value: 18, color: '#e74c3c' }
];

const recentTransactions = [
  { id: '1', type: 'INCOME' as const, amount: 48000, description: 'Consulting invoice', category: 'Business', date: new Date() },
  { id: '2', type: 'EXPENSE' as const, amount: 12800, description: 'Office rent', category: 'Rent', date: new Date(Date.now() - 86400000) },
  { id: '3', type: 'EXPENSE' as const, amount: 6400, description: 'Cloud infrastructure', category: 'Operations', date: new Date(Date.now() - 172800000) },
  { id: '4', type: 'INCOME' as const, amount: 15500, description: 'Retainer payment', category: 'Freelance', date: new Date(Date.now() - 259200000) }
];

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Track monthly performance, balances, and financial health in one calm, fast, and responsive interface."
      actions={
        <>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Export summary
          </Button>
          <Button className="bg-gold text-black hover:bg-gold-light">
            <Sparkles className="h-4 w-4" />
            New transaction
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <FinancialCard title="Total income" amount={345000} trend="+12.2%" trendLabel="Current month" tone="positive" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <FinancialCard title="Total expenses" amount={175000} trend="+4.8%" trendLabel="Current month" tone="negative" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <FinancialCard title="Net balance" amount={170000} trend="+18.4%" trendLabel="Current month" tone="positive" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <FinancialCard title="Asset value" amount={1285400} trend="+6.1%" trendLabel="Latest snapshot" tone="neutral" />
        </motion.div>
      </div>

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

        <ChartContainer title="Expense breakdown">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {expenseBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10, 14, 24, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
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
          description="Largest expense this month: office rent. Top spending category: operations. Savings rate remains healthy at 33%."
          iconName="Sparkles"
        />
      </div>
    </PageShell>
  );
}