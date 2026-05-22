require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  try {
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
      },
    });
    const orphans = [];
    for (const acc of accounts) {
      const user = await prisma.user
        .findUnique({ where: { id: acc.userId } })
        .catch(() => null);
      if (!user) orphans.push(acc);
    }
    console.log("Total accounts:", accounts.length);
    console.log("Orphan accounts:", orphans.length);
    console.dir(orphans, { depth: null });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
