import { TransactionReceipt } from 'ethers';

export abstract class BlockchainProviderPort {
  abstract getTransaction(txHash: string): Promise<{
    to: string;
    from: string;
    data: string;
    value: string;
  }>;

  abstract getReceipt(txHash: string): Promise<TransactionReceipt | null>;
}
