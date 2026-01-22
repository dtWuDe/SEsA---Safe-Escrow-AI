import { AccessTokenPayload, RefreshTokenPayload } from "./token.types";
/**
 * Service for managing JWT tokens (access and refresh tokens).
 * Provides methods for signing, verifying, and decoding tokens.
 */
export interface TokenServiceInterface {
    /**
     * Signs and returns a new access token.
     * @param payload - The token payload containing user information
     * @returns The signed access token as a string
     */
    signAccessToken(payload: AccessTokenPayload): string;

    /**
     * Signs and returns a new refresh token.
     * @param payload - The token payload containing user information
     * @returns The signed refresh token as a string
     */
    signRefreshToken(payload: RefreshTokenPayload): string;

    /**
     * Verifies the validity of an access token.
     * @param token - The access token to verify
     * @returns The decoded token payload if valid, null otherwise
     */
    verifyAccessToken(token: string): AccessTokenPayload | null;

    /**
     * Verifies the validity of a refresh token.
     * @param token - The refresh token to verify
     * @returns The decoded token payload if valid, null otherwise
     */
    verifyRefreshToken(token: string): RefreshTokenPayload | null;
}

