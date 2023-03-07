/* Based on 
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/connector.ts
 */

import { 
  SendTransactionRequest, TonConnect, UserRejectsError, 
  WalletInfo, WalletInfoInjected 
} from '@tonconnect/sdk';
import { notification } from 'antd';
import { isMobile, openLink } from './utils';

const dappMetadata = { 
  manifestUrl: 
    'https://intercambiador.pasosdeJesus.org/tonconnect-manifest.json' 
};

export const connector = new TonConnect(dappMetadata);
export async function sendTransaction(
  tx: SendTransactionRequest, wallet: WalletInfo
): Promise<{ boc: string }> {
  try {
    if ('universalLink' in wallet && 
        !(wallet as WalletInfoInjected).embedded && isMobile()) {
      openLink(addReturnStrategy(wallet.universalLink, 'none'), '_blank');
    }

    const result = await connector.sendTransaction(tx);
    notification.success({
      message: 'Transacción exitosa',
      description:
        'Su transacción ha sido enviada. ' +
        'Por favor espere a que sea incluida en el blockchain TON.',
      duration: 5,
    });
    console.log(`Send tx result: ${JSON.stringify(result)}`);
    return result;
  } catch (e) {
    let message = 'Error en transacción de envío';
    let description = '';

    if (typeof e === 'object' && e instanceof UserRejectsError) {
      message = 'Usted rechazó la transacción';
      description = 'Por favor intente de nuevo y ' +
        'confirme la transacción en su billetera.';
    }

    notification.error({
      message,
      description,
    });
    console.log(e);
    throw e;
  }
}

export function addReturnStrategy(
  url: string, returnStrategy: 'back' | 'none'
): string {
  const link = new URL(url);
  link.searchParams.append('ret', returnStrategy);
  return link.toString();
}
