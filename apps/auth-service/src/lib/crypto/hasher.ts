import { genSaltSync, hashSync, compareSync  } from "bcrypt-ts";

export const Hasher  = {
    async hashPassword(password: string) {
        const salt = await genSaltSync(10);
        return hashSync(password, salt);
    },

    async verifyPassword(password: string, hash: string) {
        return compareSync(password, hash);
    },
}