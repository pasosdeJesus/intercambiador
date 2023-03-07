/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/hooks/useTonWallet.ts
 */
import { Wallet } from '@tonconnect/sdk';
import { useEffect, useState } from 'react';
import { connector } from '../connector';

export function useTonWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(connector.wallet);

  useEffect(() => connector.onStatusChange(setWallet, console.error), []);

  return wallet;
}
