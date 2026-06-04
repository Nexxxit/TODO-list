import "dotenv/config";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | undefined;

function getPrisma(): PrismaClient {
    if (prisma) {
        return prisma;
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const adapter = new PrismaNeonHttp(connectionString, {});
    prisma = new PrismaClient({ adapter });
    return prisma;
}

export { getPrisma };
