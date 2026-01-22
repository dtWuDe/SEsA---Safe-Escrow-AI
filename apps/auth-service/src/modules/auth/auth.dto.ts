import { z } from 'zod';

export const RegisterDto = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*]/, 'Password must contain at least one special character')
});

export const LoginDto = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

export const VerifyEmailDto = z.object({
    userId: z.string().min(1, 'User ID is required'),
    code: z.string().length(6, 'OTP code must be 6 digits')
});

export const RefreshTokenDto = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailDto>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenDto>;