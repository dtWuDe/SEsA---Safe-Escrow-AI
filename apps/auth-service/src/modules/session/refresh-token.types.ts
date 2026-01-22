export interface RefreshTokenRecord {
    userId: string;
    tokenHash: string;
    revoke: boolean;
    expiryAt: Date;
}
