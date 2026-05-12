import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { liabilitySchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const body = await request.json();
    const parsed = liabilitySchema.parse(body);

    const updated = await prisma.liability.updateMany({
      where: { id: params.id, organizationId: organization.id },
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        principal: parseFloat(String(parsed.principal)),
        interestRate: parsed.interestRate,
        monthlyInstallment: parsed.monthlyInstallment ? parseFloat(String(parsed.monthlyInstallment)) : undefined,
        dueDate: parsed.dueDate,
        balance: parseFloat(String(parsed.balance)),
        description: parsed.description || undefined
      }
    });

    if (!updated.count) {
      throw new ApiError('Liability not found.', 404);
    }

    return successResponse({ updated: updated.count });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const deleted = await prisma.liability.deleteMany({
      where: { id: params.id, organizationId: organization.id }
    });

    if (!deleted.count) {
      throw new ApiError('Liability not found.', 404);
    }

    return successResponse({ deleted: deleted.count });
  } catch (error) {
    return errorResponse(error);
  }
}