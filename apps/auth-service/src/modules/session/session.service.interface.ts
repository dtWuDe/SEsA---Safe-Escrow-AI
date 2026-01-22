import { RefreshTokenRecord } from "./refresh-token.types"
import { TokenPayload } from "../auth/token.types"
/**
 * Interface for session management operations.
 * Provides methods to create, validate, refresh, and revoke user sessions.
 */
export interface SessionServiceInterface {
    /**
     * Creates a new session for a user.
     * @param userId - The unique identifier of the user
     * @returns A promise resolving to an object containing access and refresh tokens
     */
    createSession(userId: string, payload: TokenPayload): Promise<{refreshToken: string}>

    /**
     * Validates a session token.
     * @param token - The token to validate
     * @returns A promise resolving to the refresh token payload if valid
     */
    validateSession(token: string): Promise<TokenPayload | null>

    /**
     * Refreshes an existing session with a new token pair.
     * @param oldToken - The old refresh token to be replaced
     * @returns A promise resolving to an object containing refresh tokens
     */
    refreshSession(oldToken: string, payload: TokenPayload): Promise<{refreshToken: string}>

    /**
     * Revokes a specific session.
     * @param refreshToken - The refresh token of the session to revoke
     * @returns A promise that resolves when the session is revoked
     */
    revokeSession(refreshToken: string): Promise<void>

    /**
     * Revokes all sessions for a specific user.
     * @param userId - The unique identifier of the user
     * @returns A promise that resolves when all sessions are revoked
     */
    revokeAllSessions(userId: string): Promise<void>

    /**
     * Retrieves all active sessions for a user.
     * @param userId - The unique identifier of the user
     * @returns A promise resolving to an array of refresh token payloads for all user sessions
     */
    getUserSessions(userId: string): Promise<RefreshTokenRecord[] | null>
}