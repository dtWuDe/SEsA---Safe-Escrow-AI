export abstract class EscrowSyncPort {
  abstract syncByTxHash(escrowId: string, txHash: string): Promise<void>;
}
