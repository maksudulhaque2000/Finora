import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { organizationSchema } from '@/lib/validators';
import { auth } from '@/lib/auth';
import { sanitizeText } from '@/lib/utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401);
    }

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: { organization: true }
    });

    return successResponse(
      memberships.map(
        (m: { organization: unknown }) =>
          m.organization
      )
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401);
    }

    const body = await request.json();
    const parsed = organizationSchema.parse(body);

    const organization = await prisma.organization.create({
      data: {
        name: sanitizeText(parsed.name),
        type: parsed.type,
        currency: parsed.currency,
        description: parsed.description || undefined,
        memberships: {
          create: {
            userId: session.user.id,
            role: 'OWNER'
          }
        }
      }
    });

    return successResponse(organization, 201);
  } catch (error) {
    return errorResponse(error);
  }
}