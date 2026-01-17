import { prisma } from "../../lib/prisma";
import { UserRepository } from "./user.repository.interface";
import { User } from "./user.types";

export class PrismaUserRepository implements UserRepository {
    async create(email: string, passwordHash: string): Promise<User> {
        const row = await prisma.user.create({ data: { email, passwordHash } });
        return this.map(row);
    }
    
    async findByEmail(email: string): Promise<User | null> {
        const row = await prisma.user.findUnique({ where: { email } });
        return row ? this.map(row) : null;
    }
  
    async findById(id: string): Promise<User | null> {
        const row = await prisma.user.findUnique({ where: { id } })
        return row ? this.map(row) : null;
    }
    
    async updatePassword(id: string, newHashPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { passwordHash: newHashPassword }
        })
    }

    async verifyEmail(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { isVerified: true }
        })
    }

    async softDelete(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { status: 'DELETED' }
        })
    }

    private map(row: any): User {
        return {
            id: row.id,
            email: row.email,
            status: row.status,
            role: row.role,
            isVerified: row.isVerified,
            lastLoginAt: row.lastLoginAt,
        };
    }
}

