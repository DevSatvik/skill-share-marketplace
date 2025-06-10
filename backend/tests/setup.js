// tests/setup.js
import prisma from '../db/db.config.js';

beforeAll(async () => {
  // Ensure a clean slate before any tests in the suite run
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "TaskProgress",
      "Offer",
      "Skill",
      "Task",
      "Account"
    RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  // Ensure a clean slate after ALL tests in the suite have run
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "TaskProgress",
      "Offer",
      "Skill",
      "Task",
      "Account"
    RESTART IDENTITY CASCADE;
  `);
  await prisma.$disconnect();
});