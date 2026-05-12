import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}