import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api';
import { getWorkspace } from '@/lib/workspace';
import { sanitizeText } from '@/lib/utils';
import { settingsSchema } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const { session, organization } = await getWorkspace();
    const body = await request.json();
    const parsed = settingsSchema.parse(body);

    const [user, updatedOrganization] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: sanitizeText(parsed.name),
          email: parsed.email.trim().toLowerCase()
        }
      }),
      prisma.organization.update({
        where: { id: organization.id },
        data: {
          name: sanitizeText(parsed.organizationName),
          currency: parsed.currency.trim().toUpperCase(),
          description: parsed.description || undefined
        }
      })
    ]);

    return successResponse({ user, organization: updatedOrganization });
  } catch (error) {
    return errorResponse(error);
  }
}
