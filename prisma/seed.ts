import bcrypt from 'bcrypt';
import { db as prisma } from '../src/lib/db';

async function main() {
  console.log('Start seeding...');
  
  // 1. Create default admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log('Admin user seeded: admin / admin123');

  // 2. Initialize default site settings
  const defaultSettings = [
    { key: 'hotelName', value: 'Apartments12' },
    { key: 'phone', value: '+7 (999) 000-00-00' },
    { key: 'email', value: 'info@apartments12.ru' },
    { key: 'address', value: 'Москва, ул. Примерная, 12' },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('Site settings seeded');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
