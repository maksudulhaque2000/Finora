import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { transactionSchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const transaction = await prisma.transaction.findFirst({
      where: { id: params.id, organizationId: organization.id },
      include: { category: true, createdBy: true }
    });

    if (!transaction) {
      throw new ApiError('Transaction not found.', 404);
    }

    return successResponse(transaction);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const body = await request.json();
    const parsed = transactionSchema.parse(body);

    const updated = await prisma.transaction.updateMany({
      where: { id: params.id, organizationId: organization.id },
      data: {
        type: parsed.type,
        amount: parseFloat(String(parsed.amount)),
        description: sanitizeText(parsed.description),
        note: parsed.note || undefined,
        date: parsed.date,
        receiptUrl: parsed.receiptUrl || undefined,
        categoryId: parsed.categoryId,
        paymentMethod: parsed.paymentMethod || undefined,
        isRecurring: parsed.isRecurring ?? false,
        recurringRule: parsed.recurringRule || undefined
      }
    });

    if (!updated.count) {
      throw new ApiError('Transaction not found.', 404);
    }

    return successResponse({ updated: updated.count });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const deleted = await prisma.transaction.deleteMany({
      where: { id: params.id, organizationId: organization.id }
    });

    if (!deleted.count) {
      throw new ApiError('Transaction not found.', 404);
    }

    return successResponse({ deleted: deleted.count });
  } catch (error) {
    return errorResponse(error);
  }
}