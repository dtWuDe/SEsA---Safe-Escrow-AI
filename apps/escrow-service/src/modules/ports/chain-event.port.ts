import { CreateChainEvent } from '../domain/escrow.entity';
import { Prisma } from 'generated/prisma/browser';

export abstract class ChainEventPort {
  abstract createChainEvent(
    data: CreateChainEvent,
    prisma?: Prisma.TransactionClient,
  ): Promise<void>;
  abstract findByTxHash(txHash: string): Promise<CreateChainEvent[]>;
}
