//import { useTonConnect } from '../hooks/useTonConnect';
import { Button, Typography } from 'antd'
import { sendTransaction } from '../connector';
import { useTonWallet } from '../hooks/useTonWallet';
import React, { useCallback, useState } from "react";
import ReactJson from 'react-json-view';
import { useRecoilValueLoadable } from 'recoil';
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";
import { CHAIN } from "@tonconnect/protocol";
import { Ad } from "./Ad";
import { TonProofDemoApi } from '../TonProofDemoApi';
import { walletsListQuery } from '../state/wallets-list';

export function AddAd () {
  const [data, setData] = useState({});

  const wallet = useTonWallet();
  const walletsList = useRecoilValueLoadable(walletsListQuery);

  const handleClick = useCallback(async () => 
    {
      if (!wallet) {
        return;
      }
      const tx = {
        validUntil: Date.now() + 1000000,
        messages: [
          {
            address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
            amount: '20000000',
          },
          {
            address: '0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3',
            amount: '60000000',
          },
        ],
      };

      console.log(wallet.account)
      const response = sendTransaction(tx, walletsList.contents.walletsList[0])
      //const response = sendTransaction(tx, wallet)
      //const response = await TonProofDemoApi.sendAddAd(wallet.account, 6);

      setData(response);
    },
    [wallet]
  );

  if (!wallet) {
    return null;
  }

  return (
      <div className="add-ad">
      {wallet ? (
          <Button type="primary" shape="round" onClick={handleClick}>
          Crear un anuncio por 6 TON
          </Button>
          ) : (
            <div className="add-ad__error">Conecte la billetera</div>
            )}
      <ReactJson src={data} name="response" theme="ocean" />
      </div>
      );
}

