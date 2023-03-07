/* Based on
 * https://intercambiador.pasosdeJesus.org/tonconnect-manifest.json
 */
import { TonProofItemReplySuccess } from '@tonconnect/protocol';
import { Account } from '@tonconnect/sdk';
import { connector } from './connector';

class TonProofDemoApiService {
  localStorageKey = 'intercambiador-token';

  host = 'https://intercambiador.pasosdeJesus.org:4443';
  host2 = 'https://intercambiador.pasosdeJesus.org:3443';

  accessToken: string | null = null;

  constructor() {
    console.log('** TonProofDemoApi constructor');
    this.accessToken = localStorage.getItem(this.localStorageKey);

    connector.onStatusChange((wallet) => {
      if (!wallet) {
        this.reset();
        return;
      }

      const tonProof = wallet.connectItems?.tonProof;

      if (tonProof) {
        if ('proof' in tonProof) {
          this.checkProof(tonProof.proof, wallet.account);
          return;
        }

        console.error(tonProof.error);
      }

      if (!this.accessToken) {
        connector.disconnect();
      }
    });
  }

  async generatePayload() {
    console.log('** TonProofDemoApi generatePayload');
    const response = await (
      await fetch(`${this.host}/ton-proof/generatePayload`, {
        method: 'POST',
      })
    ).json();

    return response.payload as string;
  }

  async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account) {
    console.log('** TonProofDemoApi checkProof');
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      const response = await (
        await fetch(`${this.host}/ton-proof/checkProof`, {
          method: 'POST',
          body: JSON.stringify(reqBody),
        })
      ).json();

      if (response?.token) {
        localStorage.setItem(this.localStorageKey, response.token);
        this.accessToken = response.token;
      }
    } catch (e) {
      console.log('checkProof error:', e);
    }
  }

  async getAccountInfo(account: Account) {
    console.log('** TonProofDemoApi getAccoountInfo', account);
    const response = await (
      await fetch(`${this.host2}/dapp/getAccountInfo?network=${account.chain}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    ).json();

    return response as {};
  }

  reset() {
    console.log('** TonProofDemoApi reset');
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
  }
}

export const TonProofDemoApi = new TonProofDemoApiService();
