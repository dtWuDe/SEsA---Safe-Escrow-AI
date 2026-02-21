import { IsString, IsNotEmpty, IsInt, IsEthereumAddress } from "class-validator"

export class CreateEscrowIntentDto {
  @IsInt()
  chainId: number;

  @IsString()
  @IsNotEmpty()
  buyerUserId: string
  sellerUserId: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  buyerWallet: string
  sellerWallet: string
  arbitratorWallet: string;
  
  @IsString()
  jobHash: string;
}