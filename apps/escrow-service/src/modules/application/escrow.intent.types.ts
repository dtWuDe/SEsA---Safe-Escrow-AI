export interface BuildCreateEscrowIntentParams {
  chainId: number;
  contractAddress: string;

  buyerWallet: string;
  sellerWallet: string;
  arbitratorWallet: string;

  amount: bigint;

  intentExpriresAt: Date;
}

export interface TxIntent {
  chainId: number;
  to: string;
  value: bigint;
  data: string;

  intentHash: string;
  expiresAt: number;
}
