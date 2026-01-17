import { z } from 'zod';

export const UserIdDto = z.cuid();

export const CreateUserDto = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
});

export const ChangePasswordDto = z.object({
    password: z.string().min(8).max(128),
});

