import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { EscrowClientPort, EscrowIntentResponse } from "src/modules/port/escrow-client.port";
import { CreateEscrowIntent } from "src/modules/port/escrow-client.port";
import { firstValueFrom } from "rxjs";
import 'dotenv/config';

@Injectable()
export class EscrowHttpClient extends EscrowClientPort {
    private readonly escrowServiceUrl: string | undefined;

    constructor(
        private readonly httpService: HttpService, 
        private readonly configService: ConfigService,
    ) {
        super();
        this.escrowServiceUrl = this.configService.get<string>('ESCROW_SERVICE_URL');
    }

    async createEscrow(dto: CreateEscrowIntent): Promise<EscrowIntentResponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.escrowServiceUrl}/escrow/create`, dto
            ));
            return response.data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async releaseTx(escrowId: string, dto: { txHash: string }): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(`${this.configService.get('ESCROW_API_URL')}/escrow/${escrowId}/release`, dto
            ));
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async refundEscrow(escrowId: string): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(`${this.configService.get('ESCROW_API_URL')}/escrow/${escrowId}/refund`
            ));
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getEscrow(escrowId: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.configService.get('ESCROW_API_URL')}/escrow/${escrowId}`
            ));
            return response.data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async syncEscrowStatus(escrowId: string): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(`${this.configService.get('ESCROW_API_URL')}/escrow/${escrowId}/sync`
            ));
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getChainEventByTxHash(txHash: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.configService.get('ESCROW_API_URL')}/sync-tx/${txHash}`
            ));
            return response.data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}