import { EscrowIntentService } from '../../modules/application/escrow.intent.service';
import { BuildCreateEscrowIntentParams } from '../../modules/application/escrow.intent.types';
describe('EscrowIntentService', () => {
  const service = new EscrowIntentService();
  const params: BuildCreateEscrowIntentParams = {
    chainId: 1,
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    buyerWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    sellerWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    arbitratorWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    amount: 100n,
    intentExpriresAt: new Date(Date.now() + 10000),
  };

  test('same input - same intentHash', () => {
    const intent1 = service.buildCreateEscrowIntent(params);
    const intent2 = service.buildCreateEscrowIntent(params);
    expect(intent1.intentHash).toBe(intent2.intentHash);
  });

  test('changing amount changes intentHash', () => {
    const intent1 = service.buildCreateEscrowIntent(params);

    const intent2 = service.buildCreateEscrowIntent({
      ...params,
      amount: params.amount + 1n,
    });

    expect(intent1.intentHash).not.toBe(intent2.intentHash);
  });

  test('expired intent can be rejected upstream', () => {
    const intent = service.buildCreateEscrowIntent(params);
    expect(intent.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
