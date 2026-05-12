import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api';
import { categorySchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { organization } = await getWorkspace();
    const categories = await prisma.category.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(categories);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const body = await request.json();
    const parsed = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        color: parsed.color,
        icon: parsed.icon,
        organizationId: organization.id,
        createdById: session.user.id
      }
    });

    return successResponse(category, 201);
  } catch (error) {
    return errorResponse(error);
  }
}