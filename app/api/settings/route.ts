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

export async function DELETE() {
  try {
    const { session } = await getWorkspace();
    const userId = session.user.id;

    const memberships = await prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true }
    });

    const organizationIds = memberships.map((membership) => membership.organizationId);

    // Remove records that directly reference the user to satisfy relation constraints.
    await prisma.transaction.deleteMany({ where: { createdById: userId } });
    await prisma.category.updateMany({ where: { createdById: userId }, data: { createdById: null } });
    await prisma.asset.updateMany({ where: { createdById: userId }, data: { createdById: null } });
    await prisma.liability.updateMany({ where: { createdById: userId }, data: { createdById: null } });
    await prisma.organizationMember.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    // Clean up organizations that no longer have any members.
    for (const organizationId of organizationIds) {
      const memberCount = await prisma.organizationMember.count({ where: { organizationId } });
      if (memberCount > 0) {
        continue;
      }

      await prisma.transaction.deleteMany({ where: { organizationId } });
      await prisma.category.deleteMany({ where: { organizationId } });
      await prisma.asset.deleteMany({ where: { organizationId } });
      await prisma.liability.deleteMany({ where: { organizationId } });
      await prisma.organization.delete({ where: { id: organizationId } });
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
