import { Injectable } from '@nestjs/common';
import { EscrowRepositoryPort } from '../../ports/escrow.repository.port';
import { BlockchainProviderPort } from '../../ports/blockchain-provider.port';
import { decodeEscrowEvent } from './event.decoder';
import { EscrowSyncPort } from '../../ports/escrow-sync.port';
import { Escrow } from '../../domain/escrow.entity';
import { EscrowStatus } from '../../domain/escrow.types';
import { ChainEventPort } from 'src/modules/ports/chain-event.port';
import { DecodedEscrowEvent } from './event.decoder';
import * as escrowStateMachine from '../../domain/escrow.state-machine';

@Injectable()
export class PollingEscrowSyncEngine extends EscrowSyncPort {
  constructor(
    private readonly escrowRepo: EscrowRepositoryPort,
    private readonly chainEventRepo: ChainEventPort,
    private readonly provider: BlockchainProviderPort,
  ) {
    super();
  }

  async syncByTxHash(_escrowId: string, _txHash: string): Promise<void> {
    const existingEvents = await this.chainEventRepo.findByTxHash(_txHash);
    if (existingEvents && existingEvents.length > 0) {
      throw new Error('TX_ALREADY_SYNCED');
    }

    const escrow = await this.escrowRepo.findEscrowById(_escrowId);
    if (!escrow) throw new Error('ESCROW_NOT_FOUND');

    const recipt = await this.waitForReceipt(_txHash);
    const events = decodeEscrowEvent(recipt.logs);

    for (const event of events) {
      await this.handleEvent(escrow, event, _txHash);
    }
  }

  private async waitForReceipt(_txHash: string) {
    const retry = 10;

    for (let i = 0; i < retry; i++) {
      const receipt = await this.provider.getReceipt(_txHash);

      if (receipt) {
        if (receipt.status === 0) {
          throw new Error('TX_REVERTED');
        }
        return receipt;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    throw new Error('TX_NOT_CONFIRMED');
  }

  private async handleEvent(escrow: Escrow, event: any, _txHash: string) {
    switch (event.name) {
      case 'EscrowCreated':
        await this.handleEscrowCreated(escrow, event, _txHash);
        break;

      case 'EscrowReleased':
        await this.handleEscrowRelease(escrow, event, _txHash);
        break;

      case 'EscrowRefunded':
        await this.handleEscrowRefund(escrow, event, _txHash);
        break;

      default:
        throw new Error('UNKNOWN_EVENT');
    }
  }

  private async handleEscrowCreated(
    escrow: Escrow,
    event: DecodedEscrowEvent,
    _txHash: string,
  ) {
    escrowStateMachine.assertCanSubmitTx(escrow.escrowStatus);

    const escrowIndex = event.args[0] as bigint;

    await this.escrowRepo.updateEscrowWithEvent(
      escrow.id,
      _txHash,
      EscrowStatus.AWAITING_RELEASE,
      escrowIndex,
      {
        chainId: escrow.chainId,
        escrowId: escrow.id,
        txHash: _txHash,
        logIndex: event.logIndex,
        eventName: event.name,
        payload: JSON.stringify(event.args),
      },
    );
  }

  private async handleEscrowRelease(
    escrow: Escrow,
    event: DecodedEscrowEvent,
    _txHash: string,
  ) {
    escrowStateMachine.assertCanSyncRelease(escrow.escrowStatus);

    await this.escrowRepo.updateEscrowWithEvent(
      escrow.id,
      null,
      EscrowStatus.RELEASED,
      null,
      {
        chainId: escrow.chainId,
        escrowId: escrow.id,
        txHash: _txHash,
        logIndex: event.logIndex,
        eventName: event.name,
        payload: JSON.stringify(event.args),
      },
    );
  }

  private async handleEscrowRefund(
    escrow: Escrow,
    event: DecodedEscrowEvent,
    _txHash: string,
  ) {
    escrowStateMachine.assertCanSyncRefund(escrow.escrowStatus);

    await this.escrowRepo.updateEscrowWithEvent(
      escrow.id,
      null,
      EscrowStatus.REFUNDED,
      null,
      {
        chainId: escrow.chainId,
        escrowId: escrow.id,
        txHash: _txHash,
        logIndex: event.logIndex,
        eventName: event.name,
        payload: JSON.stringify(event.args),
      },
    );
  }
}
