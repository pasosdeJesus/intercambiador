/* Based on
 * https://github.com/ton-connect/demo-dapp-with-backend/blob/master/src/hooks/useTonWallet.ts
 */
import { Button, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import ReactJson from 'react-json-view';
import { useTonWallet } from '../../hooks/useTonWallet';
import { TonProofDemoApi } from '../../TonProofDemoApi';
import './style.css';

const { Title } = Typography;

export function TonProofDemo() {
  const [data, setData] = useState({});
  const wallet = useTonWallet();

  const handleClick = useCallback(async () => {
      if (!wallet) {
      return;
      }
      const response = await TonProofDemoApi.getAccountInfo(wallet.account);

      setData(response);
      }, [wallet]);

  if (!wallet) {
    return null;
  }

  return (
      <div className="ton-proof-demo">
      <Title level={3}>Demo que usa API del lado del servidor con verificación ton_proof</Title>
      {wallet ? (
          <Button type="primary" shape="round" onClick={handleClick}>
          Llamar getAccountInfo() del lado del servidor
          </Button>
          ) : (
            <div className="ton-proof-demo__error">Conecte la billetera para llamar el API</div>
            )}
      <ReactJson src={data} name="response" theme="ocean" />
      </div>
      );
}
