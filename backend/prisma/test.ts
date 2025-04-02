import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Successfully connected to the database');

    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        fullname: 'Test User',
        password: 'hashedpassword123',
        isVerified: true,
      },
    });

    console.log('Test user created:', testUser);

    // Count all users
    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 