import { IsInt, IsString } from 'class-validator';

export class CreateEscrowIntentDto {
  @IsString()
  jobId: string;

  @IsString()
  buyerWallet: string;

  @IsInt()
  chainId: number;
}
