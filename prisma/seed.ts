const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@plateforme.cd" },
    update: {},
    create: {
      email: "admin@plateforme.cd",
      name: "Administrateur Principal",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });

  // Create a sample user for a specific province
  const userPassword = await bcrypt.hash("user123", 10);
  const provinceUser = await prisma.user.upsert({
    where: { email: "user@kinshasa.cd" },
    update: {},
    create: {
      email: "user@kinshasa.cd",
      name: "Conseiller Kinshasa",
      password: userPassword,
      role: "USER",
      province: "Kinshasa",
    },
  });

  console.log({ provinceUser });
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
