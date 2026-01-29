import {
  CreateEscrow,
  CreateChainEvent,
  Escrow,
} from '../domain/escrow.entity';
import { EscrowStatus } from '../domain/escrow.types';

export abstract class EscrowRepositoryPort {
  abstract createEscrow(data: CreateEscrow): Promise<Escrow>;
  abstract findEscrowById(_escrowId: string): Promise<Escrow>;
  abstract updateEscrowStatus(
    _escrowId: string,
    _status: EscrowStatus,
  ): Promise<void>;
  abstract markOnChainCreated(
    _escrowId: string,
    _escrowIndex: bigint,
  ): Promise<void>;
  abstract attachCreateTxHash(
    _escrowId: string,
    _txHash: string,
  ): Promise<void>;
  abstract attachResolveTxHash(
    _escrowId: string,
    _txHash: string,
  ): Promise<void>;
  abstract updateEscrowWithEvent(
    _escrowId: string,
    _txHash: string | null,
    _status: EscrowStatus,
    _escrowIndex: bigint | null,
    chainEvent: CreateChainEvent,
  ): Promise<void>;
}
