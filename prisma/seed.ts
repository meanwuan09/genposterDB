import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, type UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUser(input: { email: string; password: string; name: string; role: UserRole }) {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { name: input.name, role: input.role, isActive: true }
    });
    return;
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(input.password, 12),
      name: input.name,
      role: input.role,
      isActive: true
    }
  });
}

async function main() {
  await seedUser({
    email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
    password: process.env.ADMIN_PASSWORD ?? 'admin123',
    name: 'Admin',
    role: 'admin'
  });

  await seedUser({
    email: process.env.STAFF_EMAIL ?? 'staff@example.com',
    password: process.env.STAFF_PASSWORD ?? 'staff123',
    name: 'Staff',
    role: 'staff'
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
