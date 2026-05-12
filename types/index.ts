import type { Organization, Category, Transaction, Asset, Liability, User } from '@prisma/client';

export type AppUser = User;
export type AppOrganization = Organization;
export type AppCategory = Category;
export type AppTransaction = Transaction & { category?: Category };
export type AppAsset = Asset;
export type AppLiability = Liability;

export type ApiListResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
};