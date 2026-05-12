import { format, formatDistanceToNow } from 'date-fns';

export function formatCurrency(amount: number, currency = 'BDT', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  })
    .format(amount)
    .replace(/\u00A0/g, ' ');
}

export function formatShortDate(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatLongDate(date: string | Date) {
  return format(new Date(date), 'PPP');
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}