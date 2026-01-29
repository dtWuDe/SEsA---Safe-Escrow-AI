import { Injectable } from '@nestjs/common';
import { JobContextPort } from '../ports/job-context.port';
import { EscrowSyncPort } from '../ports/escrow-sync.port';
import { EscrowIntentService } from './escrow.intent.service';
import { EscrowRepositoryPort } from '../ports/escrow.repository.port';
import {
  assertCanSubmitTx,
  assertCanSyncRelease,
} from '../domain/escrow.state-machine';
import { EscrowStatus } from '../domain/escrow.types';
import { BuildCreateEscrowIntentParams } from './escrow.intent.types';
import { CreateEscrow } from '../domain/escrow.entity';

@Injectable()
export class EscrowService {
  constructor(
    private readonly jobContext: JobContextPort,
    private readonly intentService: EscrowIntentService,
    private readonly syncEngine: EscrowSyncPort,
    private readonly escrowRepo: EscrowRepositoryPort,
  ) {}
  async createIntent(params: {
    jobId: string;
    buyerWallet: string;
    chainId: number;
  }) {
    const job = await this.jobContext.getJobForEscrow(params.jobId);
    console.log('buyerWallet', params.buyerWallet);
    // validate
    if (job.buyerWallet.toLowerCase() != params.buyerWallet.toLowerCase()) {
      throw new Error('BUYER_WALLET_MISMATCH');
    }

    const intentParams: BuildCreateEscrowIntentParams = {
      chainId: params.chainId,
      contractAddress: job.contractAddress,
      buyerWallet: job.buyerWallet,
      sellerWallet: job.sellerWallet,
      arbitratorWallet: job.arbitratorWallet,
      amount: job.amount,
      intentExpriresAt: new Date(Date.now() + 30000),
    };

    const intent = this.intentService.buildCreateEscrowIntent(intentParams);

    const escrowCreateParams: CreateEscrow = {
      chainId: params.chainId,
      buyerUserId: job.buyerUserId,
      sellerUserId: job.sellerUserId,
      contractAddress: job.contractAddress,
      sellerWallet: job.sellerWallet,
      buyerWallet: job.buyerWallet,
      arbitratorWallet: job.arbitratorWallet,
      intentHash: intent.intentHash,
      jobHash: job.jobHash,
      amount: job.amount,
      escrowStatus: EscrowStatus.INIT,
    };
    console.log('escrowCreateParams', escrowCreateParams);
    const escrow = await this.escrowRepo.createEscrow(escrowCreateParams);

    return {
      intent,
      escrow,
    };
  }

  async submitTx(params: { escrowId: string; txHash: string }) {
    // validate
    const escrow = await this.escrowRepo.findEscrowById(params.escrowId);

    if (!escrow) throw new Error('ESCROW_NOT_FOUND');

    // State Machine
    assertCanSubmitTx(escrow.escrowStatus);

    // Attach TxHash
    await this.escrowRepo.attachCreateTxHash(escrow.id, params.txHash);

    // Trigger Sync
    await this.syncEngine.syncByTxHash(escrow.id, params.txHash);

    return { success: true };
  }

  async getEscrow(escrowId: string) {
    const escrow = await this.escrowRepo.findEscrowById(escrowId);

    if (!escrow) throw new Error('ESCROW_NOT_FOUND');

    return escrow;
  }

  async releaseTx(params: { escrowId: string; txHash: string }) {
    const escrow = await this.escrowRepo.findEscrowById(params.escrowId);

    if (!escrow) throw new Error('ESCROW_NOT_FOUND');

    assertCanSyncRelease(escrow.escrowStatus);

    await this.escrowRepo.attachResolveTxHash(escrow.id, params.txHash);

    await this.syncEngine.syncByTxHash(escrow.id, params.txHash);

    return { success: true };
  }
}
