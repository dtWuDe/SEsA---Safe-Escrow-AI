export abstract class JobContextPort {
  abstract getJobForEscrow(jobId: string): Promise<{
    buyerUserId: string;
    sellerUserId: string;
    buyerWallet: string;
    sellerWallet: string;
    arbitratorWallet: string;
    amount: bigint;
    contractAddress: string;
    jobHash: string;
  }>;
}
