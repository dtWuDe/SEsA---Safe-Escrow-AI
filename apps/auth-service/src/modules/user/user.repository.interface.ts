import { User } from './user.types';

export interface UserRepository {
    create(email: string, passwordHash: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(id: string, newHashPassword: string): Promise<void>;
    verifyEmail(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
}