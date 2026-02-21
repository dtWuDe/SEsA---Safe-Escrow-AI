export interface CreateEscrowIntent {
    jobId?: string
    chainId: number
    buyerUserId: string
    sellerUserId: string
    buyerWallet: string
    sellerWallet: string
    arbitratorWallet: string
    amount: bigint
    jobHash: string
}

export class EscrowIntentResponse {
    escrowId: string
    intentData: any
}

export abstract class EscrowClientPort {
    abstract createEscrow(dto: CreateEscrowIntent): Promise<EscrowIntentResponse>;
    abstract releaseTx(escrowId: string, dto: { txHash: string }): Promise<void>;
    abstract refundEscrow(escrowId: string): Promise<void>;
    abstract getEscrow(escrowId: string): Promise<any>;
    abstract getChainEventByTxHash(txHash: string): Promise<any>;
}