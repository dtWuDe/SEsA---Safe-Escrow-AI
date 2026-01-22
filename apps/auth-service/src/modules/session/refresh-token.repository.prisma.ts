import { RefreshTokenRepositoryInterface } from './refresh-token.repository.interface';
import { RefreshTokenRecord } from './refresh-token.types';
import { PrismaClient } from '../../../generated/prisma/client';
import { jwtConfig } from '../../config/jwt';
/**
 * Implementation of RefreshTokenRepository using Prisma ORM.
 * Handles persistence and management of refresh tokens for authentication.
 * 
 * @class RefreshTokenRepositoryImpl
 * @implements {RefreshTokenRepository}
 */
export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
    constructor(
        private readonly prismaClient: PrismaClient
    ) {}
    async save(userId: string, token: string): Promise<void> {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + 604800000);
        console.log(expiryDate);
        await this.prismaClient.refreshToken.create({ 
            data: {
                userId: userId, 
                tokenHash: token,
                expiryAt: expiryDate
            } 
        });
    }
    
    async find(token: string): Promise<RefreshTokenRecord | null> {
        const row = await this.prismaClient.refreshToken.findFirst({
             where: {
                tokenHash: token,
                revoked: false,
                expiryAt: { gt: new Date() } 
            } 
        });
        return row ? this.map(row) : null;
    }

    async findByUser(userid: string): Promise<RefreshTokenRecord[]> {
        const rows = await this.prismaClient.refreshToken.findMany({
            where: { 
                userId: userid, 
                revoked: false, 
                expiryAt: { gt: new Date() } 
            }
        })

        return rows.map(this.map);
    }

    async revoke(token: string): Promise<void> {
        await this.prismaClient.refreshToken.update({
            where: { tokenHash: token },
            data: { revoked: true }
        })
    }

    async revokeAll(userId: string): Promise<void> {
        await this.prismaClient.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true }
        })
    }

    async rotate(token: string, newToken: string): Promise<void> {
        await this.prismaClient.refreshToken.update({
            where: { tokenHash: token },
            data: { tokenHash: newToken }
        })
    }

    private map(row: any): RefreshTokenRecord {
        return {
            userId: row.userId,
            tokenHash: row.tokenHash,
            revoke: row.revoked,
            expiryAt: row.expiryAt,
        };
    }
}