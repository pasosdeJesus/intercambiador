/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/hooks/useTonWalletConnectionError.ts
 */
import { UserRejectsError } from '@tonconnect/sdk';
import { useCallback, useEffect } from 'react';
import { connector } from '../connector';

export function useTonWalletConnectionError(callback: () => void) {
  const errorsHandler = useCallback(
    (error: unknown) => {
      if (typeof error === 'object' && error instanceof UserRejectsError) {
        callback();
      }
    },
    [callback],
  );

  const emptyCallback = useCallback(() => {}, []);

  useEffect(() => 
            connector.onStatusChange(emptyCallback, errorsHandler), 
            [emptyCallback, errorsHandler]
           );
}
