import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kamiPassword = await bcrypt.hash('Watusi04', 10);

  const kami = await prisma.user.create({
    data: {
      email: `juaneldios007@live.com.mx`,
      username: 'Kamiganzo',
      password: kamiPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
