import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.role.upsert({
    create: { name: "USER" },
    update: {},
    where: { name: "USER" },
  });
  await prisma.role.upsert({
    create: { name: "ADMIN" },
    update: {},
    where: { name: "ADMIN" },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
