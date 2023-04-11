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
import { TonProofApi } from '../TonProofApi';
import { walletsListQuery } from '../state/wallets-list';
import * as AdsConstants from '../../../scripts/ads_constants';


export function AddAd () {
  const [data, setData] = useState({});

  const wallet = useTonWallet();
  const walletsList = useRecoilValueLoadable(walletsListQuery);

  const handleClick = useCallback(async () => 
    {
      if (!wallet) {
        return;
      }
      console.log("wallet.account=", wallet.account)

      const response = await TonProofApi.getSellingAdMsg();

      console.log("response=", response);

      const tx = {
        validUntil: Date.now() + 1000000,
        messages: [
          {
            address: AdsConstants.adsContractAddress,
            amount: '5200000000',  // 5.2 TON
            payload: response['bocbase64']
          },
        ],
      };

      console.log("wallet.account", wallet.account)
      const response2 = await sendTransaction(
        tx, walletsList.contents.walletsList[0]
      )

      console.log("response2", response2);

      //const response = sendTransaction(tx, wallet)
      //const response = await TonProofApi.sendAddAd(wallet.account, 6);

      setData(response2);
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

