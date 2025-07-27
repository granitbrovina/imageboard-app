import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 8) {
    console.error('Error: Please set a strong password of at least 8 characters in the prisma/seed.ts file.');
    return;
  }

  console.log(`Preparing to create admin user: ${adminUsername}`);

  const existingAdmin = await prisma.staff.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log(`Admin user '${adminUsername}' already exists. No action taken.`);
    return;
  }

  const hashedPassword = await hash(adminPassword, 12);

  const user = await prisma.staff.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Seeding initial static pages...');

await prisma.staticPage.upsert({
  where: { slug: 'rules' },
  update: {},
  create: {
    slug: 'rules',
    title: 'Board Rules',
    content: '<h1>Board Rules</h1><p>1. Be excellent to each other.</p><p>2. No illegal content.</p><p>3. Follow the golden rule.</p>',
  },
});

await prisma.staticPage.upsert({
  where: { slug: 'about' },
  update: {},
  create: {
    slug: 'about',
    title: 'About This Site',
    content: '<h1>About Us</h1><p>This is a modern imageboard.</p>',
  },
});

console.log('✅ Static pages seeded.');

  console.log(`✅ Successfully created new admin user:`);
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {

    await prisma.$disconnect();
  });
