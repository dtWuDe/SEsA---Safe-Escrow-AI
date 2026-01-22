import { z } from 'zod';

export const userIdDto = z.cuid();

export const emailDto = z.email();

export const createUserDto = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
});

export const changePasswordDto = z.object({
    password: z.string().min(8).max(128),
});

