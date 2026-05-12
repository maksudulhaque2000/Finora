import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { categorySchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const body = await request.json();
    const parsed = categorySchema.parse(body);

    const updated = await prisma.category.updateMany({
      where: { id: params.id, organizationId: organization.id },
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        color: parsed.color,
        icon: parsed.icon
      }
    });

    if (!updated.count) {
      throw new ApiError('Category not found.', 404);
    }

    return successResponse({ updated: updated.count });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { organization } = await getWorkspace();
    const deleted = await prisma.category.deleteMany({
      where: { id: params.id, organizationId: organization.id }
    });

    if (!deleted.count) {
      throw new ApiError('Category not found.', 404);
    }

    return successResponse({ deleted: deleted.count });
  } catch (error) {
    return errorResponse(error);
  }
}