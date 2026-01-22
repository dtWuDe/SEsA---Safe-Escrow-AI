import { RefreshTokenRecord } from "./refresh-token.types";
/**
 * Repository interface for managing refresh tokens.
 * Handles persistence, retrieval, and lifecycle management of refresh tokens.
 */
export interface RefreshTokenRepositoryInterface {
    /**
     * Saves a new refresh token for a user.
     * @param userId - The ID of the user
     * @param token - The refresh token to save
     * @returns A promise that resolves when the token is saved
     */
    save(userId: string, token: string): Promise<void>;

    /**
     * Finds and retrieves a refresh token by its value.
     * @param token - The refresh token to search for
     * @returns A promise that resolves to the token payload if found, or null if not found
     */
    find(token: string): Promise<RefreshTokenRecord | null>;

    /**
     * Finds and retrieves a refresh token by its user ID.
     * @param userid - The ID of the user
     * @returns A promise that resolves to an array of token payloads
     */
    findByUser(userid: string): Promise<RefreshTokenRecord[]>;
    
    /**
     * Revokes a specific refresh token.
     * @param token - The refresh token to revoke
     * @returns A promise that resolves when the token is revoked
     */ 
    revoke(token: string): Promise<void>;

    /**
     * Revokes all refresh tokens for a specific user.
     * @param userId - The ID of the user whose tokens should be revoked
     * @returns A promise that resolves when all tokens are revoked
     */
    revokeAll(userId: string): Promise<void>;

    /**
     * Rotates a refresh token by replacing it with a new one.
     * @param token - The old refresh token to replace
     * @param newToken - The new refresh token
     * @returns A promise that resolves when the token is rotated
     */
    rotate(token: string, newToken: string): Promise<void>;
}