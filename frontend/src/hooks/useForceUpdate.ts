/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/hooks/useForceUpdate.ts
 */
import { useState } from 'react';

export function useForceUpdate() {
  const [_, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}
