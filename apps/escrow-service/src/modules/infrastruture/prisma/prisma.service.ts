import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma } from 'src/lib/prisma/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Expose Prisma instance
  public readonly client = Prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get escrow() {
    return this.client.escrow;
  }

  get chainEvent() {
    return this.client.chainEvent;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }
}
