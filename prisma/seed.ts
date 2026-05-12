import { PrismaClient, OrgType, TransactionType, AssetType, LiabilityType, MemberRole, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('Password123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@finora.app' },
    update: {},
    create: {
      name: 'Finora Admin',
      email: 'admin@finora.app',
      passwordHash
    }
  });

  const organization = await prisma.organization.upsert({
    where: { id: 'finora-demo-org' },
    update: {},
    create: {
      id: 'finora-demo-org',
      name: 'Finora Group',
      type: OrgType.BUSINESS,
      currency: 'BDT',
      description: 'Seeded demo organization for local development.'
    }
  });

  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: organization.id } },
    update: {},
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: MemberRole.OWNER
    }
  });

  const categoryPairs = [
    { name: 'Salary', type: TransactionType.INCOME, color: '#2ecc71', icon: 'Banknote' },
    { name: 'Business', type: TransactionType.INCOME, color: '#58a6ff', icon: 'BriefcaseBusiness' },
    { name: 'Food', type: TransactionType.EXPENSE, color: '#e74c3c', icon: 'Utensils' },
    { name: 'Rent', type: TransactionType.EXPENSE, color: '#d4a853', icon: 'House' },
    { name: 'Operations', type: TransactionType.EXPENSE, color: '#8b949e', icon: 'Settings2' }
  ] as const;

  const categories = await Promise.all(
    categoryPairs.map((category) =>
      prisma.category.upsert({
        where: {
          id: `${organization.id}-${category.name.toLowerCase()}`
        },
        update: {},
        create: {
          id: `${organization.id}-${category.name.toLowerCase()}`,
          name: category.name,
          type: category.type,
          color: category.color,
          icon: category.icon,
          organizationId: organization.id,
          createdById: user.id
        }
      })
    )
  );

  await prisma.transaction.deleteMany({ where: { organizationId: organization.id } });
  await prisma.asset.deleteMany({ where: { organizationId: organization.id } });
  await prisma.liability.deleteMany({ where: { organizationId: organization.id } });

  const [salary, business, food, rent, operations] = categories;

  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.INCOME,
        amount: 86000,
        description: 'Monthly salary',
        date: new Date(),
        categoryId: salary.id,
        organizationId: organization.id,
        createdById: user.id,
        paymentMethod: 'Bank transfer'
      },
      {
        type: TransactionType.INCOME,
        amount: 45000,
        description: 'Client retainer',
        date: new Date(Date.now() - 86400000),
        categoryId: business.id,
        organizationId: organization.id,
        createdById: user.id,
        paymentMethod: 'Bank transfer'
      },
      {
        type: TransactionType.EXPENSE,
        amount: 12800,
        description: 'Office rent',
        date: new Date(Date.now() - 172800000),
        categoryId: rent.id,
        organizationId: organization.id,
        createdById: user.id,
        paymentMethod: 'Bank transfer'
      },
      {
        type: TransactionType.EXPENSE,
        amount: 6400,
        description: 'Cloud infrastructure',
        date: new Date(Date.now() - 259200000),
        categoryId: operations.id,
        organizationId: organization.id,
        createdById: user.id,
        paymentMethod: 'Card'
      },
      {
        type: TransactionType.EXPENSE,
        amount: 2100,
        description: 'Team lunch',
        date: new Date(Date.now() - 345600000),
        categoryId: food.id,
        organizationId: organization.id,
        createdById: user.id,
        paymentMethod: 'Cash'
      }
    ]
  });

  await prisma.asset.createMany({
    data: [
      {
        name: 'Cash on hand',
        type: AssetType.CASH,
        value: 65000,
        organizationId: organization.id,
        createdById: user.id
      },
      {
        name: 'Business bank account',
        type: AssetType.BANK,
        value: 840000,
        organizationId: organization.id,
        createdById: user.id
      },
      {
        name: 'Equipment',
        type: AssetType.EQUIPMENT,
        value: 380000,
        organizationId: organization.id,
        createdById: user.id
      }
    ]
  });

  await prisma.liability.createMany({
    data: [
      {
        name: 'Working capital loan',
        type: LiabilityType.LOAN,
        principal: 240000,
        balance: 240000,
        interestRate: 12,
        monthlyInstallment: 15000,
        dueDate: new Date(Date.now() + 14 * 86400000),
        organizationId: organization.id,
        createdById: user.id
      },
      {
        name: 'Vendor payable',
        type: LiabilityType.PAYABLE,
        principal: 42000,
        balance: 42000,
        interestRate: 0,
        monthlyInstallment: 7000,
        dueDate: new Date(Date.now() + 7 * 86400000),
        organizationId: organization.id,
        createdById: user.id
      }
    ]
  });

  console.log('Seed completed successfully.');
}

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });