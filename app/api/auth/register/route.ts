import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse, ApiError } from '@/lib/api';
import { registerSchema } from '@/lib/validators';
import { sanitizeText } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const email = parsed.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError('An account with this email already exists.', 409);
    }

    const passwordHash = await hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: {
        name: sanitizeText(parsed.name),
        email,
        passwordHash
      }
    });

    const organization = await prisma.organization.create({
      data: {
        name: sanitizeText(parsed.organizationName),
        type: parsed.organizationType,
        currency: 'BDT',
        memberships: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        },
        categories: {
          createMany: {
            data: [
              { name: 'Salary', type: 'INCOME', color: '#2ecc71', icon: 'Banknote' },
              { name: 'Business', type: 'INCOME', color: '#58a6ff', icon: 'BriefcaseBusiness' },
              { name: 'Food', type: 'EXPENSE', color: '#e74c3c', icon: 'Utensils' },
              { name: 'Utilities', type: 'EXPENSE', color: '#d4a853', icon: 'Plug' }
            ]
          }
        }
      }
    });

    return successResponse({ userId: user.id, organizationId: organization.id }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}