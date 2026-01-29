import { Injectable } from '@nestjs/common';
import { JobContextPort } from 'src/modules/ports/job-context.port';

@Injectable()
export class MockJobContext extends JobContextPort {
  async getJobForEscrow(jobId: string): Promise<{
    buyerUserId: string;
    sellerUserId: string;
    buyerWallet: string;
    sellerWallet: string;
    arbitratorWallet: string;
    amount: bigint;
    contractAddress: string;
    jobHash: string;
  }> {
    return {
      buyerUserId: 'cmknzofa20000b4t6u32ob481',
      sellerUserId: 'cmkoyp1oz00009wt6tmc2xmrw',
      buyerWallet: '0xA4Be7e614AC71bFf31B2BB85A86d67c8C49134BF',
      sellerWallet: '0xf923E0C2F3c2FEe6F53Dc0b989d88294860156cd',
      arbitratorWallet: '0x55AE6EBB29Dd2800a0EF7B3BD74C5cfCb95C4B8a',
      amount: 1_000_000_000_000_000_000n,
      contractAddress: '0xF433041B8752479e6534c418eDa103879D1531F1',
      jobHash: '',
    };
  }
}
