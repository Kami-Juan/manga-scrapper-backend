import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kamiPassword = await bcrypt.hash('Watusi04', 10);
  const sofitoonsPassword = await bcrypt.hash('Sofitoons05', 10);
  const karolPassword = await bcrypt.hash('Karol001', 10);

  const kami = await prisma.user.create({
    data: {
      email: `juaneldios007@live.com.mx`,
      username: 'Kamiganzo',
      password: kamiPassword,
    },
  });

  const sofitoons = await prisma.user.create({
    data: {
      email: `sofitoons@hotmail.com`,
      username: 'SofiToons',
      password: sofitoonsPassword,
    },
  });

  const karol = await prisma.user.create({
    data: {
      email: `karol@hotmail.com`,
      username: 'Karol',
      password: karolPassword,
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
