/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/state/auth-payload.ts
 */
import { isWalletInfoInjected } from '@tonconnect/sdk';
import { selector } from 'recoil';
import { connector } from '../connector';
import { TonProofApi } from '../TonProofApi';

// You can use any state manager, recoil is used just for example.

export const authPayloadQuery = selector({
  key: 'authPayload',
  get: async () => {
    const tonProofPayload = await TonProofApi.generatePayload();

    return {
      tonProofPayload,
    };
  },
});
