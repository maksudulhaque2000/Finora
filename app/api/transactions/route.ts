import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { transactionSchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';
import { isRateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const clientId = request.headers.get('x-forwarded-for') ?? session.user.id;

    if (isRateLimited(`transactions:get:${clientId}`)) {
      throw new ApiError('Too many requests. Please try again in a minute.', 429);
    }

    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get('page') ?? '1'), 1);
    const pageSize = Math.min(Math.max(Number(url.searchParams.get('pageSize') ?? '25'), 1), 25);
    const type = url.searchParams.get('type') || undefined;
    const categoryId = url.searchParams.get('categoryId') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId: organization.id,
        ...(type ? { type: type as 'INCOME' | 'EXPENSE' | 'TRANSFER' } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              OR: [
                { description: { contains: search, mode: 'insensitive' } },
                { note: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {}),
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {})
              }
            }
          : {})
      },
      include: { category: true, createdBy: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: 'desc' }
    });

    const total = await prisma.transaction.count({
      where: { organizationId: organization.id }
    });

    return successResponse(transactions, 200, { page, pageSize, total });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const clientId = request.headers.get('x-forwarded-for') ?? session.user.id;

    if (isRateLimited(`transactions:post:${clientId}`)) {
      throw new ApiError('Too many requests. Please slow down.', 429);
    }

    const body = await request.json();
    const parsed = transactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        type: parsed.type,
        amount: parseFloat(String(parsed.amount)),
        description: sanitizeText(parsed.description),
        note: parsed.note || undefined,
        date: parsed.date,
        receiptUrl: parsed.receiptUrl || undefined,
        categoryId: parsed.categoryId,
        organizationId: organization.id,
        createdById: session.user.id,
        paymentMethod: parsed.paymentMethod || undefined,
        isRecurring: parsed.isRecurring ?? false,
        recurringRule: parsed.recurringRule || undefined
      }
    });

    return successResponse(transaction, 201);
  } catch (error) {
    return errorResponse(error);
  }
}