import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Database connection function
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};