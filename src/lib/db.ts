import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const g = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

export const prisma = g.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;
