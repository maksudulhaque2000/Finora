import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api';
import { liabilitySchema } from '@/lib/validators';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { organization } = await getWorkspace();
    const liabilities = await prisma.liability.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(liabilities);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const body = await request.json();
    const parsed = liabilitySchema.parse(body);

    const liability = await prisma.liability.create({
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        principal: parseFloat(String(parsed.principal)),
        interestRate: parsed.interestRate,
        monthlyInstallment: parsed.monthlyInstallment ? parseFloat(String(parsed.monthlyInstallment)) : undefined,
        dueDate: parsed.dueDate,
        balance: parseFloat(String(parsed.balance)),
        description: parsed.description || undefined,
        organizationId: organization.id,
        createdById: session.user.id
      }
    });

    return successResponse(liability, 201);
  } catch (error) {
    return errorResponse(error);
  }
}