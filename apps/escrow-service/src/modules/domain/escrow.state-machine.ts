import { EscrowStatus } from './escrow.types';

export class EscrowStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EscrowStateError';
  }
}

export function assertCanCreateIntent() {
  // allway allow
}

export function assertCanSubmitTx(status: EscrowStatus) {
  if (status !== EscrowStatus.INIT) {
    throw new EscrowStateError(
      `Cannot submit tx when escrow status = ${status}`,
    );
  }
}

export function assertCanSyncOnchainCreated(status: EscrowStatus) {
  if (status !== EscrowStatus.INIT) {
    throw new EscrowStateError(
      `Cannot sync onchain created when escrow status = ${status}`,
    );
  }
}

export function assertCanSyncRelease(status: EscrowStatus) {
  if (status !== EscrowStatus.AWAITING_RELEASE) {
    throw new EscrowStateError(
      `Cannot sync release when escrow status = ${status}`,
    );
  }
}

export function assertCanSyncRefund(status: EscrowStatus) {
  if (status !== EscrowStatus.RELEASED) {
    throw new EscrowStateError(
      `Cannot sync refund when escrow status = ${EscrowStatus[status]}`,
    );
  }
}

export function assertCanSyncCancel(status: EscrowStatus) {
  if (status !== EscrowStatus.INIT) {
    throw new EscrowStateError(
      `Cannot sync cancel when escrow status = ${EscrowStatus[status]}`,
    );
  }
}
