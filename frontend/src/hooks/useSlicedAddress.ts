/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/hooks/useForceUpdate.ts
 */
import { useMemo } from 'react';
import TonWeb from 'tonweb';

export function useSlicedAddress(address: string | null | undefined) {
  return useMemo(() => {
    if (!address) {
      return '';
    }

    // convert address from 0:<hex> format to user-friendly format
    const userFriendlyAddress = new TonWeb.Address(address).
      toString(true, true, true);

    return userFriendlyAddress.slice(0, 4) + '...' + 
      userFriendlyAddress.slice(-3);
  }, [address]);
}
