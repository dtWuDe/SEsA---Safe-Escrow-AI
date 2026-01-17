export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type UserRole = 'USER' | 'ADMIN' | 'ARBITRATOR';

export interface User {
    id: string;
    email: string;
    status: UserStatus;
    role: UserRole;
    isVerified: boolean;
    lastLoginAt: Date | null;
}