import { Injectable } from '@nestjs/common';
import { ChainEventPort } from '../../ports/chain-event.port';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChainEvent } from '../../domain/escrow.entity';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class ChainEventPrismaRepository extends ChainEventPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createChainEvent(
    data: CreateChainEvent,
    prisma?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = prisma ?? this.prisma.client;
    await client.chainEvent.create({
      data: {
        chainId: data.chainId,
        escrowId: data.escrowId,
        txHash: data.txHash,
        logIndex: data.logIndex,
        eventName: data.eventName,
        payload: data.payload,
      },
    });
  }

  async findByTxHash(txHash: string): Promise<CreateChainEvent[]> {
    const rows = await this.prisma.chainEvent.findMany({ where: { txHash } });
    return rows.map((row) => this.map(row));
  }

  private map(rows: any): CreateChainEvent {
    return {
      chainId: rows.chainId,
      escrowId: rows.escrowId,
      txHash: rows.txHash,
      logIndex: rows.logIndex,
      eventName: rows.eventName,
      payload: rows.payload,
    };
  }
}
