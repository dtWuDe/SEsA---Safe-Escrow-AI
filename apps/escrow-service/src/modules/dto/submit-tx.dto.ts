import { IsString } from 'class-validator';

export class SubmitTxDto {
  @IsString()
  escrowId: string;
  @IsString()
  txHash: string;
}

export class ReleaseTxDto {
  @IsString()
  escrowId: string;
  @IsString()
  txHash: string;
}
