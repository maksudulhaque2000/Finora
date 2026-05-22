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
    let deleted = [];
    for (const acc of accounts) {
      const user = await prisma.user
        .findUnique({ where: { id: acc.userId } })
        .catch(() => null);
      if (!user) {
        console.log("Deleting orphan account:", acc);
        await prisma.account.delete({ where: { id: acc.id } });
        deleted.push(acc.id);
      }
    }
    console.log("Deleted account ids:", deleted);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
