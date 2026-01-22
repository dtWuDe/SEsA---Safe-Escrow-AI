import { RefreshTokenRepository } from "./refresh-token.repository.prisma";
import { TokenService } from "../auth/token.service";
import { SessionServiceInterface } from "./session.service.interface";
import { RefreshTokenRecord } from "./refresh-token.types";
import { RefreshTokenPayload } from "../auth/token.types";


export class SessionService implements SessionServiceInterface {
    constructor(
        private readonly refreshTokenRepo: RefreshTokenRepository,
        private readonly tokenService: TokenService
    ){}

    async createSession(userId: string): Promise<{ refreshToken: string }> {
        const exists = await this.refreshTokenRepo.findByUser(userId);
        if (exists.length > 0) await this.refreshTokenRepo.revokeAll(userId);
        const payload: RefreshTokenPayload = {
            sub: userId,
            type: 'refresh'
        }
        const refreshToken =  this.tokenService.signRefreshToken(payload);
    
        await this.refreshTokenRepo.save(userId, refreshToken);

        return {refreshToken};
    }

    async validateSession(token: string): Promise<RefreshTokenPayload | null> {
        const exists = await this.refreshTokenRepo.find(token);
        if (!exists) throw new Error("REFRESH_TOKEN_NOT_FOUND");

        const decoded = this.tokenService.verifyRefreshToken(token);
        if (!decoded) throw new Error("INVALID_REFRESH_TOKEN");
        
        return decoded;
    }   

    async refreshSession(oldToken: string): Promise<{ refreshToken: string }> {
        const exist = await this.refreshTokenRepo.find(oldToken);
        if (!exist) throw new Error("REFRESH_TOKEN_NOT_FOUND");
        
        const decoded = this.tokenService.verifyRefreshToken(oldToken);
        if (!decoded) throw new Error("INVALID_REFRESH_TOKEN");

        const payload: RefreshTokenPayload = {
            sub: decoded.sub,
            type: 'refresh'
        }

        const newRefreshToken = this.tokenService.signRefreshToken(payload);

        // save new refresh token
        await this.refreshTokenRepo.rotate(oldToken, newRefreshToken);

        return {refreshToken: newRefreshToken};
    }

    async revokeSession(token: string): Promise<void> {
        await this.refreshTokenRepo.revoke(token);
    }

    async revokeAllSessions(userId: string): Promise<void> {
        await this.refreshTokenRepo.revokeAll(userId);
    }

    async getUserSessions(userId: string): Promise<RefreshTokenRecord[]> {
        const rows = await this.refreshTokenRepo.findByUser(userId);
        return rows.map(this.map);
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