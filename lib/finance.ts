import { Prisma } from '@prisma/client';

export type TransactionLike = {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number | Prisma.Decimal;
  category?: { name: string } | null;
  date: Date | string;
  description: string;
};

const toNumber = (value: number | Prisma.Decimal) => Number(value);

export function calculateSummary(transactions: TransactionLike[]) {
  const income = transactions
    .filter((transaction) => transaction.type === 'INCOME')
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);
  const transfers = transactions
    .filter((transaction) => transaction.type === 'TRANSFER')
    .reduce((total, transaction) => total + toNumber(transaction.amount), 0);

  return {
    income,
    expenses,
    transfers,
    balance: income - expenses,
    netCashFlow: income - expenses - transfers
  };
}

export function buildLedger(transactions: TransactionLike[]) {
  let runningBalance = 0;

  return transactions
    .slice()
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .map((transaction) => {
      const amount = toNumber(transaction.amount);
      if (transaction.type === 'INCOME') {
        runningBalance += amount;
      } else if (transaction.type === 'EXPENSE') {
        runningBalance -= amount;
      }

      return {
        ...transaction,
        amount,
        runningBalance
      };
    });
}

export function groupByCategory(transactions: TransactionLike[]) {
  const map = new Map<string, number>();

  for (const transaction of transactions) {
    const key = transaction.category?.name ?? 'Uncategorized';
    const current = map.get(key) ?? 0;
    map.set(key, current + toNumber(transaction.amount));
  }

  return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }));
}

export function buildBalanceSheet(assets: number, liabilities: number) {
  return {
    assets,
    liabilities,
    equity: assets - liabilities,
    ratio: liabilities === 0 ? assets : assets / liabilities
  };
}