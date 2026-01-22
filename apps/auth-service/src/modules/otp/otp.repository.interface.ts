import { OTP } from "./otp.types";
/**
 * Interface for OTP (One-Time Password) repository operations.
 * Provides methods for managing OTP records including creation, validation, and cleanup.
 */
export interface OTPRepositoryInterface {
    /**
     * Saves a new OTP record to the repository.
     * @param purpose - The purpose or context for which the OTP is issued
     * @param code - The OTP code value
     * @param createdAt - The timestamp when the OTP was created
     * @param expiresAt - The timestamp when the OTP expires
     * @returns A promise that resolves when the OTP is successfully saved
     */
    save(userId: string, purpose: string, code: string, createdAt: Date, expiresAt: Date): Promise<void>;

    /**
     * Finds and validates an OTP code for a given purpose.
     * @param purpose - The purpose or context to search for
     * @param code - The OTP code to validate
     * @returns A promise that resolves to true if a valid, non-expired OTP is found; false otherwise
     */
    findValid(userId: string, purpose: string, code: string): Promise<OTP | null>;

    /**
     * Marks an OTP record as used, preventing it from being used again.
     * @param id - The unique identifier of the OTP record to mark as used
     * @returns A promise that resolves when the OTP is successfully marked as used
     */
    markUsed(id: string): Promise<void>;

    /**
     * Deletes all OTP records associated with a specific user.
     * @param id - The identifier of the user whose OTP records should be deleted
     * @returns A promise that resolves when all OTP records for the user are deleted
     */
    deleteAllByUser(userId: string): Promise<void>;
}

