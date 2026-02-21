import { OnModuleInit, OnModuleDestroy, Injectable } from "@nestjs/common";
import { Prisma } from "src/lib/prisma/prismaClient";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    public readonly client = Prisma;

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }

    get job() {
        return this.client.job;
    }

    get $transaction() {
        return this.client.$transaction.bind(this.client);
    }
}