export type OTPPurpose = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH';

export interface OTP {
    id: string;
    purpose: OTPPurpose;
    userId: string;
    codeHash: string;
    createdAt: Date;
    expiresAt: Date;
    used: boolean;
    attemptCount: number;
}
