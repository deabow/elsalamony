import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@elsalamony.com";
  const defaultPassword = "admin123456";

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Force update/upsert so the password for admin@elsalamony.com is ALWAYS admin123456
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user password reset & verified for: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
