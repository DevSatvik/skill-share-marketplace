import { PrismaClient } from "@prisma/client";

// Single instance of PrismaClient
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

prisma.$use(async (params, next) => {
  console.log(`👉 Prisma Action - ${params.model}.${params.action}`);
  console.log('\n');
  console.log(`👉 Args:`, params.args);
  console.log('\n');
  const result = await next(params);
  return result;
});

export default prisma;