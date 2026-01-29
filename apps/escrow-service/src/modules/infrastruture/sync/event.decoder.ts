import { Interface } from 'ethers';
import { ESCROW_ABI } from '@packages/web3';
import { LogDescription } from 'ethers';

const iface = new Interface(ESCROW_ABI);

export interface DecodedEscrowEvent extends LogDescription {
  logIndex: number;
}

export function decodeEscrowEvent(logs) {
  return logs
    .map((log) => {
      console.log('log', log);
      try {
        return {
          ...iface.parseLog(log),
          logIndex: log.index,
        } as DecodedEscrowEvent;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}
