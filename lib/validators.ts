import { z } from 'zod';

const positiveMoney = z.coerce.number().positive();
const trimmedString = z.string().trim().min(3);

export const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128)
});

export const registerSchema = authSchema.extend({
  name: z.string().trim().min(2).max(80),
  organizationName: z.string().trim().min(2).max(120),
  organizationType: z.enum(['FAMILY', 'BUSINESS', 'NGO', 'PERSONAL'])
});

export const organizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(['FAMILY', 'BUSINESS', 'NGO', 'PERSONAL']),
  currency: z.string().trim().min(3).max(5),
  description: z.string().trim().max(500).optional().or(z.literal(''))
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  organizationName: z.string().trim().min(2).max(120),
  currency: z.string().trim().min(3).max(5),
  description: z.string().trim().max(500).optional().or(z.literal(''))
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().trim().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  icon: z.string().trim().min(1).max(40)
});

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: positiveMoney,
  description: trimmedString,
  note: z.string().trim().max(500).optional().or(z.literal('')),
  date: z.coerce.date(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().min(1),
  paymentMethod: z.string().trim().max(40).optional().or(z.literal('')),
  isRecurring: z.boolean().optional(),
  recurringRule: z.string().trim().max(120).optional().or(z.literal(''))
});

export const assetSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(['CASH', 'BANK', 'PROPERTY', 'EQUIPMENT', 'VEHICLE', 'INVENTORY', 'OTHER']),
  value: positiveMoney,
  purchaseDate: z.coerce.date().optional(),
  description: z.string().trim().max(500).optional().or(z.literal(''))
});

export const liabilitySchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.enum(['LOAN', 'PAYABLE', 'DUE', 'OTHER']),
  principal: positiveMoney,
  interestRate: z.coerce.number().min(0).max(100),
  monthlyInstallment: z.coerce.number().positive().optional(),
  dueDate: z.coerce.date().optional(),
  balance: positiveMoney,
  description: z.string().trim().max(500).optional().or(z.literal(''))
});

export const dateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  organizationId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional()
});

export const loginSchema = authSchema;

export type AuthValues = z.infer<typeof authSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type OrganizationValues = z.infer<typeof organizationSchema>;
export type SettingsValues = z.infer<typeof settingsSchema>;
export type CategoryValues = z.infer<typeof categorySchema>;
export type TransactionValues = z.infer<typeof transactionSchema>;
export type AssetValues = z.infer<typeof assetSchema>;
export type LiabilityValues = z.infer<typeof liabilitySchema>;