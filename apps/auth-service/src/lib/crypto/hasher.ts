import * as bcrypt from 'bcrypt';

export class Hasher {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
};
