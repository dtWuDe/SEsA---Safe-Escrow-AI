import { User } from './user.types';

/**
 * Repository interface for User entity operations.
 * Provides methods for creating, retrieving, and updating user data.
 */
export interface UserRepositoryInterface {
    /**
     * Creates a new user with the provided email and password hash.
     * @param email - The user's email address
     * @param passwordHash - The hashed password for the user
     * @returns A promise that resolves to the newly created User object
     */
    create(email: string, passwordHash: string): Promise<User>;
    
    /**
     * Finds a user by their email address.
     * @param email - The email address to search for
     * @returns A promise that resolves to the User object if found, or null if not found
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Finds a user by their unique identifier.
     * @param id - The user's unique identifier
     * @returns A promise that resolves to the User object if found, or null if not found
     */
    findById(id: string): Promise<User | null>;

    /**
     * Updates a user's password with a new hashed password.
     * @param id - The user's unique identifier
     * @param newHashPassword - The new hashed password
     * @returns A promise that resolves when the password has been updated
     */
    updatePassword(id: string, newHashPassword: string): Promise<void>;

    /**
     * Marks a user's email as verified.
     * @param id - The user's unique identifier
     * @returns A promise that resolves when the email verification is complete
     */
    verifyEmail(id: string): Promise<void>;

    /**
     * Performs a soft delete on a user record.
     * @param id - The user's unique identifier
     * @returns A promise that resolves when the user has been soft deleted
     */
    softDelete(id: string): Promise<void>;
}