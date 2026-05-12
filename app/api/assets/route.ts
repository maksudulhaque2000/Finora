import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api';
import { assetSchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { organization } = await getWorkspace();
    const assets = await prisma.asset.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(assets);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const body = await request.json();
    const parsed = assetSchema.parse(body);

    const asset = await prisma.asset.create({
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        value: parseFloat(String(parsed.value)),
        purchaseDate: parsed.purchaseDate,
        description: parsed.description || undefined,
        organizationId: organization.id,
        createdById: session.user.id
      }
    });

    return successResponse(asset, 201);
  } catch (error) {
    return errorResponse(error);
  }
}