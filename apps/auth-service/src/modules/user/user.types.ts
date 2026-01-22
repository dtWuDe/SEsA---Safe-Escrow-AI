export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type UserRole = 'USER' | 'ADMIN' | 'ARBITRATOR';

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    status: UserStatus;
    role: UserRole;
    isVerified: boolean;
    lastLoginAt: Date | null;
}