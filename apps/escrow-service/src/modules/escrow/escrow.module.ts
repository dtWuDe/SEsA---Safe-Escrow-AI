import { Module } from '@nestjs/common';
import { EscrowPrismaRepository } from '../infrastruture/prisma/escrow.prisma.repository';
import { EscrowService } from '../application/escrow.service';
import { EscrowRepositoryPort } from '../ports/escrow.repository.port';
import { EscrowSyncPort } from '../ports/escrow-sync.port';
import { PollingEscrowSyncEngine } from '../infrastruture/sync/polling-sync.engine';
import { JobContextPort } from '../ports/job-context.port';
import { MockJobContext } from 'src/test/mocks/mock-job-context';
import { EscrowIntentService } from '../application/escrow.intent.service';
import { EscrowController } from './escrow.controller';
import { PrismaService } from '../infrastruture/prisma/prisma.service';
import { BlockchainProviderPort } from '../ports/blockchain-provider.port';
import { EtherProvider } from '../infrastruture/blockchain/ethers.provider';
import { ChainEventPort } from '../ports/chain-event.port';
import { ChainEventPrismaRepository } from '../infrastruture/prisma/chain-event.prisma.repository';

@Module({
  controllers: [EscrowController],
  providers: [
    PrismaService,
    EscrowService,
    EscrowIntentService,
    {
      provide: EscrowRepositoryPort,
      useClass: EscrowPrismaRepository,
    },
    {
      provide: EscrowSyncPort,
      useClass: PollingEscrowSyncEngine,
    },
    {
      provide: JobContextPort,
      useClass: MockJobContext,
    },
    {
      provide: BlockchainProviderPort,
      useClass: EtherProvider,
    },
    {
      provide: ChainEventPort,
      useClass: ChainEventPrismaRepository,
    },
  ],
})
export class EscrowModule {}
