import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, TransactionReceipt } from 'ethers';
import { BlockchainProviderPort } from '../../ports/blockchain-provider.port';
import 'dotenv/config';

@Injectable()
export class EtherProvider extends BlockchainProviderPort {
  private provider: JsonRpcProvider;

  constructor() {
    super();
    this.provider = new JsonRpcProvider(process.env.RPC_URL);
  }

  async getTransaction(
    txHash: string,
  ): Promise<{ to: string; from: string; data: string; value: string }> {
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) throw new Error('TX_NOT_FOUND');

    return {
      to: tx.to!,
      from: tx.from,
      data: tx.data,
      value: tx.value.toString(),
    };
  }

  async getReceipt(txHash: string): Promise<TransactionReceipt | null> {
    return await this.provider.getTransactionReceipt(txHash);
  }
}
