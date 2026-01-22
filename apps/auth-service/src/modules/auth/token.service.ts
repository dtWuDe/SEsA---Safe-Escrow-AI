import { TokenServiceInterface } from "./token.service.interface";
import { AccessTokenPayload, RefreshTokenPayload } from "./token.types";
import jwt from 'jsonwebtoken';
import { jwtConfig } from "../../config/jwt";
/**
 * Implementation of the TokenService interface for JWT token management.
 * Handles creation, verification, and decoding of access and refresh tokens.
 */
export class TokenService implements TokenServiceInterface {
    constructor(
        private readonly secretAcessToken: string,
        private readonly secretRefreshToken: string,
    ) {}

    signAccessToken(payload: AccessTokenPayload): string {
        const data: AccessTokenPayload = {...payload, type: 'access'}
        return jwt.sign(
            data,
            this.secretAcessToken,
            {expiresIn: '15m'} // 15 minutes // should be configurable
        )
    }

    signRefreshToken(payload: RefreshTokenPayload): string {
        const data: RefreshTokenPayload = {...payload, type: 'refresh'}
        return jwt.sign(
            data,
            this.secretRefreshToken,
            {expiresIn: '7d'} // should be configurable
        )
    }

    verifyAccessToken(token: string): AccessTokenPayload | null {
        return jwt.verify(token, this.secretAcessToken) as AccessTokenPayload | null;
    }

    verifyRefreshToken(token: string): RefreshTokenPayload | null {
        return jwt.verify(token, this.secretRefreshToken) as RefreshTokenPayload | null;
    }
}
