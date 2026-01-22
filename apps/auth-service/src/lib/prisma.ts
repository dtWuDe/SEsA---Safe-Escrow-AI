import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const ConnectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({
    connectionString: ConnectionString,
    enableLogging: true,
});

export const prisma = new PrismaClient({
    adapter   
});