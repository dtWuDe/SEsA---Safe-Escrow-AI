import { PrismaClient } from '../../../generated/prisma/client';
import { UserRepositoryInterface } from "./user.repository.interface";
import { User } from "./user.types";

/**
 * Prisma-based implementation of the UserRepository interface.
 * Handles all database operations for user entities using Prisma ORM.
 */
export class UserRepository implements UserRepositoryInterface {
    constructor(
        private readonly prismaClient: PrismaClient,
    ) {}

    async create(email: string, passwordHash: string): Promise<User> {
        const row = await this.prismaClient.user.create({ data: { email, passwordHash } });
        return this.map(row);
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const row = await this.prismaClient.user.findUnique({ where: { email } });
        return row ? this.map(row) : null;
    }
  
    async findById(userId: string): Promise<User | null> {
        console.log("user.repository.findById ",userId);
        const row = await this.prismaClient.user.findUnique({ where: { id: userId } })
        return row ? this.map(row) : null;
    }
    
    async updatePassword(userId: string, newHashPassword: string): Promise<void> {
        await this.prismaClient.user.update({
            where: { id: userId },
            data: { passwordHash: newHashPassword }
        })
    }

    async verifyEmail(id: string): Promise<void> {
        await this.prismaClient.user.update({
            where: { id },
            data: { isVerified: true }
        })
    }

    async softDelete(userId: string): Promise<void> {
        await this.prismaClient.user.update({
            where: { id: userId },
            data: { status: 'DELETED' }
        })
    }
    
    private map(row: any): User {
        return {
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            status: row.status,
            role: row.role,
            isVerified: row.isVerified,
            lastLoginAt: row.lastLoginAt,
        };
    }
}

