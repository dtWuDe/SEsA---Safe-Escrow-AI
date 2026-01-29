import { EscrowStatus as PrismaEscrowStatus } from 'generated/prisma/enums';
import { EscrowStatus as DomainEscrowStatus } from '../../domain/escrow.types';

export function toPrismaEscrowStatus(
  status: DomainEscrowStatus,
): PrismaEscrowStatus {
  return PrismaEscrowStatus[status];
}
