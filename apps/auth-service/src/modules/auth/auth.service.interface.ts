/**
 * Authentication service interface defining core authentication operations.
 * Provides methods for user authentication, token management, and account operations.
 */
/**
 * Interface for authentication service operations.
 * Provides methods for user authentication, token management, session handling, and account verification.
 * 
 * @interface AuthServiceInterface
 * @description Defines the contract for authentication service implementations including login, token refresh,
 * logout operations, user registration, and email verification capabilities.
 */
export interface AuthServiceInterface {
    /**
     * Authenticates a user with email and password credentials.
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise resolving to an object containing access and refresh tokens
     */
    login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string } >

    /**
     * Refreshes an expired access token using a valid refresh token.
     * @param refreshToken - The refresh token used to obtain a new access token
     * @returns A promise resolving to an object containing new access and refresh tokens
     */
    refresh(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>

    /**
     * Logs out a user by invalidating their refresh token.
     * @param refreshToken - The refresh token to invalidate
     * @returns A promise that resolves when logout is complete
     */
    logout(userId: string,refreshToken: string): Promise<void>

    /**
     * Logs out a user from all sessions by invalidating all their refresh tokens.
     * @param userId - The user's unique identifier
     * @returns A promise that resolves when all sessions are invalidated
     */
    logoutAll(userId: string, refreshToken: string): Promise<void>

    /**
     * Registers a new user with the provided email and password.
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise resolving to an object containing access and refresh tokens
     */
    register(email: string, password: string): Promise<{ code: string}>

    /**
     * Verifies a user's email address using a verification token.
     * @param token - The email verification token
     * @returns A promise that resolves when email verification is complete
     */
    // resetPassword(token: string, newPassword: string): Promise<void>

    /**
     * Verifies a user's email address using a verification token.
     * @param userid - The user's unique identifier
     * @param code - The verification code
     * @returns A promise that resolves when email verification is complete
     */
    verifyEmail(userid: string, code: string): Promise<void>
}