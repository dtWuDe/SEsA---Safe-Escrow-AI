import { EscrowStatus } from './escrow.types';

export interface Escrow {
  id: string;

  chainId: number;
  contractAddress: string;
  escrowIndex: bigint;

  sellerUserId: string;
  buyerUserId: string;

  sellerWallet: string;
  buyerWallet: string;
  arbitratorWallet: string;
  intentHash: string;

  jobHash: string;

  amount: bigint;
  escrowStatus: EscrowStatus;
}

export interface CreateEscrow {
  chainId: number;
  contractAddress: string;

  sellerUserId: string;
  buyerUserId: string;

  sellerWallet: string;
  buyerWallet: string;
  arbitratorWallet: string;
  intentHash: string;

  jobHash: string;

  amount: bigint;

  escrowStatus: EscrowStatus;
}

export interface CreateChainEvent {
  chainId: number;
  escrowId: string;
  txHash: string;
  logIndex: number;
  eventName: string;
  payload: string;
}
