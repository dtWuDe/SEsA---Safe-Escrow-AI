import { UserRepository } from './user.repository.interface';
import { Hasher } from '../../lib/crypto/hasher';

export class UserService {
    constructor(private readonly user: UserRepository) {}

    async getById(id: string) {
        const user = await this.user.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async markEmailVerified(id: string) {
        return this.user.verifyEmail(id);
    }

    async createUser(email: string, password: string) {
        const passwordHash = await Hasher.hashPassword(password);
        return this.user.create(email, passwordHash);
    }

    async changePassword(id: string, newPassword: string) {
        const newHashPassword = await Hasher.hashPassword(newPassword);
        return this.user.updatePassword(id, newHashPassword);
    }

    async deactivateUser(id: string) {
        return this.user.softDelete(id);
    }
}