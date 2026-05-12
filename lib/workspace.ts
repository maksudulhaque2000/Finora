import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/api';

export async function getWorkspace() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiError('Unauthorized', 401);
  }

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true }
  });

  if (!membership) {
    throw new ApiError('No organization found for this account.', 404);
  }

  return {
    session,
    organization: membership.organization,
    role: membership.role
  };
}

export async function assertOrganizationAccess(userId: string, organizationId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId, organizationId }
  });

  if (!membership) {
    throw new ApiError('Access denied to the requested organization.', 403);
  }

  return membership;
}