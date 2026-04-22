import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'pabloadmin@example.com';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('Admin já existe.');
    return;
  }

  const passwordHash = await hash('admin123', 6);

  await prisma.user.create({
    data: {
      name: 'Pablo Admin',
      email,
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Admin criado com sucesso.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });