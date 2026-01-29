import { keccak256, toUtf8Bytes } from 'ethers';
import { encodeCreateEscrow } from '@packages/web3';

import { BuildCreateEscrowIntentParams, TxIntent } from './escrow.intent.types';

export class EscrowIntentService {
  buildCreateEscrowIntent(params: BuildCreateEscrowIntentParams): TxIntent {
    const {
      chainId,
      contractAddress,
      buyerWallet,
      sellerWallet,
      arbitratorWallet,
      amount,
      intentExpriresAt,
    } = params;

    const expiresAt = Math.floor(intentExpriresAt.getTime() / 1000);

    const data = encodeCreateEscrow({
      seller: sellerWallet,
      arbitrator: arbitratorWallet,
      amount,
    });

    const value = amount;

    const intentHash = this.buildIntentHash({
      chainId,
      contractAddress,
      buyerWallet,
      sellerWallet,
      arbitratorWallet,
      amount,
      expiresAt,
      data,
    });

    return {
      chainId,
      to: contractAddress,
      value,
      data,
      intentHash,
      expiresAt,
    };
  }

  buildIntentHash(input: {
    chainId: number;
    contractAddress: string;
    buyerWallet: string;
    sellerWallet: string;
    arbitratorWallet: string;
    amount: bigint;
    expiresAt: number;
    data: string;
  }): string {
    const payload = [
      input.chainId,
      input.contractAddress.toLocaleLowerCase(),
      input.buyerWallet.toLocaleLowerCase(),
      input.sellerWallet.toLocaleLowerCase(),
      input.arbitratorWallet.toLocaleLowerCase(),
      input.amount.toString(),
      input.expiresAt,
      input.data,
    ].join('|');

    return keccak256(toUtf8Bytes(payload));
  }
}
