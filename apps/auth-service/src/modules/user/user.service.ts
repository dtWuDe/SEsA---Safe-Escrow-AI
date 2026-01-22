import { UserRepository } from './user.repository.prisma';
import { UserServiceInterface } from './user.service.interface';
import { Hasher } from '../../lib/crypto/hasher';

/**
 * Service for managing user operations including authentication and profile management.
 * Provides methods for user retrieval, email verification, password management, and account deactivation.
 */
export class UserService implements UserServiceInterface {
    constructor(
        private readonly user: UserRepository,
        private readonly hasher: Hasher
    ) {}

    async getById(userId: string) {
        const user = await this.user.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.user.findByEmail(email);
        if (!user) throw new Error('User not found');
        return user;
    }

    async markEmailVerified(userId: string){
        await this.getById(userId);
        await this.user.verifyEmail(userId);
    }

    async createUser(email: string, password: string) {
        const exists = await this.user.findByEmail(email);
        if (exists) throw new Error('User already exists');
        
        const passwordHash = await this.hasher.hashPassword(password);
        return this.user.create(email, passwordHash);
    }

    async changePassword(userId: string, newPassword: string) {
        await this.getById(userId);

        const newHashPassword = await this.hasher.hashPassword(newPassword);
        await this.user.updatePassword(userId, newHashPassword);
    }

    async deactivateUser(userId: string) {
        await this.getById(userId);

        await this.user.softDelete(userId);
    }
}