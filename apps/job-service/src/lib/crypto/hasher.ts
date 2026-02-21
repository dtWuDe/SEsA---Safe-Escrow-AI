import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Hasher {
  async hash(payload: string) {
    return bcrypt.hash(payload, 10);
  }

  async verify(payload: string, hash: string) {
    return bcrypt.compare(payload, hash);
  }
};