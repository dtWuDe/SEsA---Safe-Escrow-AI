import { Injectable } from '@nestjs/common';
import { EscrowRepositoryPort } from '../../ports/escrow.repository.port';
import { PrismaService } from './prisma.service';
import {
  CreateChainEvent,
  CreateEscrow,
  Escrow,
} from '../../domain/escrow.entity';
import { EscrowStatus } from '../../domain/escrow.types';
import { toPrismaEscrowStatus } from './escrow-status.mapper';
import { ChainEventPort } from 'src/modules/ports/chain-event.port';

@Injectable()
export class EscrowPrismaRepository extends EscrowRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chainEventRepo: ChainEventPort,
  ) {
    super();
  }

  async createEscrow(data: CreateEscrow): Promise<Escrow> {
    const row = await this.prisma.escrow.create({
      data: {
        chainId: data.chainId,
        contractAddress: data.contractAddress,
        sellerUserId: data.sellerUserId,
        buyerUserId: data.buyerUserId,
        sellerWallet: data.sellerWallet,
        buyerWallet: data.buyerWallet,
        arbitratorWallet: data.arbitratorWallet,
        intentHash: data.intentHash,
        jobHash: data.jobHash,
        amount: data.amount,
        escrowStatus: toPrismaEscrowStatus(data.escrowStatus),
      },
    });
    return this.map(row);
  }

  async findEscrowById(escrowId: string): Promise<Escrow> {
    const row = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
    });
    return this.map(row);
  }

  async updateEscrowStatus(
    _escrowId: string,
    _status: EscrowStatus,
  ): Promise<void> {
    const escrowStatus = toPrismaEscrowStatus(_status);
    await this.prisma.escrow.update({
      where: { id: _escrowId },
      data: { escrowStatus },
    });
  }

  async attachCreateTxHash(_escrowId: string, _txHash: string): Promise<void> {
    await this.prisma.escrow.update({
      where: { id: _escrowId },
      data: { txCreate: _txHash },
    });
  }

  async attachResolveTxHash(_escrowId: string, _txHash: string): Promise<void> {
    await this.prisma.escrow.update({
      where: { id: _escrowId },
      data: { txResolve: _txHash },
    });
  }

  async markOnChainCreated(
    _escrowId: string,
    _escrowIndex: bigint,
  ): Promise<void> {
    await this.prisma.escrow.update({
      where: { id: _escrowId },
      data: {
        escrowStatus: toPrismaEscrowStatus(EscrowStatus.AWAITING_RELEASE),
        escrowIndex: _escrowIndex,
      },
    });
  }

  async updateEscrowWithEvent(
    _escrowId: string,
    _txHash: string,
    _status: EscrowStatus,
    _escrowIndex: bigint | null,
    chainEvent: CreateChainEvent,
  ): Promise<void> {
    await this.prisma.$transaction(
      async (tx) => {
        const updateData: any = {
          escrowStatus: toPrismaEscrowStatus(_status),
        };

        if (_txHash) updateData.txCreate = _txHash;

        if (_escrowIndex) updateData.escrowIndex = _escrowIndex;

        await tx.escrow.update({
          where: { id: _escrowId },
          data: updateData,
        });

        await this.chainEventRepo.createChainEvent(chainEvent, tx);
      },
      {
        timeout: 1000,
      },
    );
  }

  private map(row: any): Escrow {
    return {
      id: row.id,
      chainId: row.chainId,
      contractAddress: row.contractAddress,
      sellerUserId: row.sellerUserId,
      buyerUserId: row.buyerUserId,
      sellerWallet: row.sellerWallet,
      buyerWallet: row.buyerWallet,
      arbitratorWallet: row.arbitratorWallet,
      intentHash: row.intentHash,
      jobHash: row.jobHash,
      amount: row.amount,
      escrowStatus: row.escrowStatus,
      escrowIndex: row.escrowIndex,
    };
  }
}
