"use client";

import React from 'react';
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
import { ChartContainer } from '@/components/chart-container';

type MonthlyDatum = { month: string; income: number; expense: number; balance: number };
type ExpenseEntry = { name: string; value: number; color: string };

export default function DashboardCharts({
  monthlyData,
  expenseBreakdown
}: {
  monthlyData: MonthlyDatum[];
  expenseBreakdown: ExpenseEntry[];
}) {
  return (
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
    </>
  );
}
