/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/TonProofDemoApi.ts
 */
import { TonProofItemReplySuccess } from '@tonconnect/protocol';
import { Account } from '@tonconnect/sdk';
import { connector } from './connector';
import * as AdsConstants from '../../scripts/ads_constants'

class TonProofApiService {
  localStorageKey = 'intercambiador-token';

  accessToken: string | null = null;

  constructor() {
    console.log('** TonProofApi constructor');
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
    console.log('** TonProofApi generatePayload');
    const response = await (
      await fetch(`${AdsConstants.authBackend}/ton-proof/generatePayload`, {
        method: 'POST',
      })
      .then(response => {
        if (!response.ok) {
          alert(response);
          return Promise.reject(response);
        }
        return response;
      })
      .then(data => {
        console.log("Success");
        return data;
      })
    ).json();

    return response.payload as string;
  }

  async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account) {
    console.log('** TonProofApi checkProof');
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
        await fetch(`${AdsConstants.authBackend}/ton-proof/checkProof`, {
          method: 'POST',
          body: JSON.stringify(reqBody),
        })
        .then(response => {
          if (!response.ok) {
            alert(response);
            return Promise.reject(response);
          }
          return response;
        })
        .then(data => {
          console.log("Success");
          return data;
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
    console.log('** TonProofApi getAccoountInfo', account);
    const response = await (
      await fetch(`${AdsConstants.dbBackend}/dapp/getAccountInfo?network=${account.chain}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          alert(response);
          return Promise.reject(response);
        }
        return response;
      })
      .then(data => {
        console.log("Success");
        return data;
      })
    ).json();

    return response as {};
  }

  async getSellingAdsList(account: Account) {
    console.log('** TonProofApi getSellingAdsList', account);
    const response = await (
      await fetch(`${AdsConstants.dbBackend}/anunciosventa.json`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          alert(response);
          return Promise.reject(response);
        }
        return response;
      })
      .then(data => {
        console.log("Success");
        return data;
      })

    ).json();

    return response as {}; 
  }

  async getSellingAdMsg(
    account: Account, tonAmount: number, tonMin: number, percentage: number,
    maxTime: number, paymentMethods: Array<string>,
    commerceName: string, referenceForPayment: string, nameForPayment: string
  ) {
    console.log("** TonProofApi getSellingAdMsg. account=", account, 
                ", tonAmount=", tonAmount,
                ", tonMin=", tonMin,
                ", percentage=", percentage,
                ", maxTime=", maxTime,
                ", paymentMethods=", paymentMethods,
                ", commerceName=", commerceName,
                ", referenceForPayment=", referenceForPayment,
                ", nameForPayment=", nameForPayment
               );
    const response = await (
      await fetch(`${AdsConstants.dbBackend}/anuncioventa_preparar.json?` +
                  `cantidadTon=${tonAmount}&` +
                  `minTon=${tonMin}&` +
                  `porcentaje=${percentage}&` +
                  `tiempoMaximo=${maxTime}&` +
                  `metodosPago=${paymentMethods}&` +
                  `commerceName=${commerceName}&` + 
                  `referenceForPayment=${referenceForPayment}&` +
                  `nameForPayment=${nameForPayment}`
                  , {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) {
          alert(response);
          return Promise.reject(response);
        }
        return response;
      })
      .then(data => {
        console.log("Success");
        return data;
      })
    ).json();

    return response as {}; 
  }

  reset() {
    console.log('** TonProofApi reset');
    this.accessToken = null;
    localStorage.removeItem(this.localStorageKey);
  }
}

export const TonProofApi = new TonProofApiService();
