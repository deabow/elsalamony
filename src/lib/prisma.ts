import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL || "";

declare global {
  var prismaGlobal: undefined | PrismaClient;
  var pgPoolGlobal: undefined | Pool;
}

const getPgPool = () => {
  if (!globalThis.pgPoolGlobal) {
    globalThis.pgPoolGlobal = new Pool({
      connectionString,
      max: 10, // Limit active connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 5000, // Timeout after 5s if DB is unreachable
      keepAlive: true,
    });
  }
  return globalThis.pgPoolGlobal;
};

const createPrismaClient = () => {
  const pool = getPgPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
