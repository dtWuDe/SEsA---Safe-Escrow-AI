import { User } from "./user.types";

/**
 * Service interface for managing user operations.
 * Provides methods for user creation, authentication, and account management.
 */
export interface UserServiceInterface {
    /**
     * Retrieves a user by their unique identifier.
     * @param id - The user's unique identifier
     * @returns A promise that resolves to the User object
     * @throws Will throw an error if the user is not found
     */
    getById(id: string): Promise<User | null>
    
    /**
     * Retrieves a user by their email address.
     * @param email - The user's email address
     * @returns A promise that resolves to the User object
     * @throws Will throw an error if the user is not found
     */
    getByEmail(email: string): Promise<User | null>

    /**
     * Marks a user's email address as verified.
     * @param id - The user's unique identifier
     * @returns A promise that resolves when the email verification is marked
     * @throws Will throw an error if the user is not found
     */
    markEmailVerified(id: string): Promise<void>
    
    /**
     * Creates a new user with the provided credentials.
     * @param email - The user's email address
     * @param password - The user's password
     * @returns A promise that resolves to the newly created User object
     * @throws Will throw an error if the email already exists or validation fails
     */
    createUser(email: string, password: string): Promise<User>
    
    /**
     * Changes a user's password.
     * @param id - The user's unique identifier
     * @param newPassword - The new password to set
     * @returns A promise that resolves when the password is changed
     * @throws Will throw an error if the user is not found or password validation fails
     */
    changePassword(id: string, newPassword: string): Promise<void>
    
    /**
     * Deactivates a user account.
     * @param id - The user's unique identifier
     * @returns A promise that resolves when the user account is deactivated
     * @throws Will throw an error if the user is not found
     */
    deactivateUser(id: string): Promise<void>
}