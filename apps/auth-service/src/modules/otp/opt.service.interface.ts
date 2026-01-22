/**
 * Interface for OTP (One-Time Password) service operations.
 * Defines methods for generating, creating, and verifying OTPs for user authentication and authorization purposes.
 */
export interface OTPServiceInterface {
    /**
     * Generates a random OTP string.
     * @returns {string} A generated OTP code.
     */
    generateOtp(): string;

    /**
     * Creates and stores an OTP for a specific user and purpose.
     * @param {string} userId - The unique identifier of the user.
     * @param {string} purpose - The purpose for which the OTP is created
     * @returns {Promise<string>} A promise that resolves to the created OTP code.
     */
    createOTP(userId: string, purpose: string): Promise<string>;

    /**
     * Verifies an OTP code for a specific user and purpose.
     * @param {string} userId - The unique identifier of the user.
     * @param {string} purpose - The purpose for which the OTP is being verified.
     * @param {string} code - The OTP code to verify.
     * @returns {Promise<boolean>} A promise that resolves to true if the OTP is valid, false otherwise.
     */
    verifyOTP(userId: string, purpose: string, code: string): Promise<boolean>;
}