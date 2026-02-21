import { IsDateString, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Transform } from 'class-transformer';
import { JobStatus } from "generated/prisma/enums";

export class CreateJobDto {
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    buyerUserId: string;

    @IsNotEmpty()
    @IsEthereumAddress()
    buyerAddress: string;
    
    @IsNumber()
    chainId: number;

    @IsNumber()
    amount:bigint;

    @IsDateString()
    expiriesAt: Date; 
}

export class AcceptSellerDto {
    @IsNotEmpty()
    @IsString()
    sellerUserId: string;

    @IsNotEmpty()
    @IsEthereumAddress()
    sellerWallet: string;
}

export class JobFundedDto {
    @IsNotEmpty()
    @IsString()
    escrowId: string;

    @IsNotEmpty()
    @IsString()
    jobHash: string;  
    
    @IsNotEmpty()
    @IsString()
    txHash: string;
}