import { PrismaClient } from "../../../generated/prisma/client";
import { OTPRepositoryInterface } from "./otp.repository.interface";
import { OTP, OTPPurpose } from "./otp.types";

export class OTPRepository implements OTPRepositoryInterface {
    constructor(
        private readonly prismaClient: PrismaClient
    ){}
    async save(userId: string, purpose: OTPPurpose, code: string, createdAt: Date, expiryAt: Date): Promise<void> {
        await this.prismaClient.oTP.create({ data: { userId, purpose, codeHash: code, createdAt, expiryAt} });
    }

    async findValid(userId: string, purpose: OTPPurpose, code: string): Promise<OTP | null> {
        const row = await this.prismaClient.oTP.findFirst({ 
            where: {
                codeHash: code,
                purpose, 
                userId,
                used: false, 
                expiryAt: { 
                    gt: new Date() 
                } 
            } 
        });

        return row ? this.map(row) : null;
    }

    async markUsed(id: string): Promise<void> {
        await this.prismaClient.oTP.update({
            where: { id }, 
            data: { used: true } 
        });
    }

    async deleteAllByUser(userId: string): Promise<void> {
        await this.prismaClient.oTP.deleteMany({ 
            where: { 
                userId 
            } 
        });
    }

    private map(row: any): OTP {
        return {
            id: row.id,
            purpose: row.purpose,
            userId: row.userId,
            codeHash: row.codeHash,
            createdAt: row.createdAt,
            expiresAt: row.expiresAt,
            used: row.used,
            attemptCount: row.attemptCount,
        };
    }
}