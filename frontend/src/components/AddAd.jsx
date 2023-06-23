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
  const [tonAmount, setTonAmount] = useState("6.2");
  const [tonMin, setTonMin] = useState("6");
  const [percentage, setPercentage] = useState("101.0");
  const [maxTime, setMaxTime] = useState("15");
  const [paymentMethods, setPaymentMethods] = useState(["NEQUI"]);
  const [referenceForPayment, setReferenceForPayment] = useState("");
  const [nameForPayment, setNameForPayment] = useState("");

  const wallet = useTonWallet();
  const walletsList = useRecoilValueLoadable(walletsListQuery);

  const handleClick = useCallback(async () => 
    {
      if (!wallet) {
        return;
      }
      console.log("wallet.account=", wallet.account)

      const response = await TonProofApi.getSellingAdMsg(wallet.account, 
        tonAmount, tonMin, percentage, maxTime, paymentMethods);

      if (typeof response != "undefined" && typeof response['bocbase64'] != "undefined") {
        console.log("response=", response);

        const tx = {
          validUntil: Date.now() + 1000000,
          messages: [
            {
              address: AdsConstants.adsContractAddress,
              amount: tonAmount * 1000000000, // '5200000000',  // 5.2 TON
              payload: response['bocbase64']
            },
          ],
        };

        console.log("wallet.account", wallet.account)
        const response2 = await sendTransaction(
          tx, wallet //walletsList.contents.walletsList[0]
        )

        console.log("response2", response2);

        setData(response2);
      }
    },
    [wallet]
  );

  if (!wallet) {
    return null;
  }

  return (
      <div className="add-ad">
      {wallet ? (
        <div>
          <div>
            <label>Cantidad máxima de TON por vender (Entre 6 y 200)</label>
            <input style={{ marginRight: 8 }}
              type="number"
              value={tonAmount}
              onChange={(e) => setTonAmount(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Cantidad mínima por vender (Entre 6 y la cantidad máxima)</label>
            <input style={{ marginRight: 8 }}
              type="number"
              value={tonMin}
              onChange={(e) => setTonMin(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Porcentaje de ganancia sobre tasa oficial (Entre 100 y 130)</label>
            <input style={{ marginRight: 8 }}
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            ></input>
          </div>
         <div>
            <label>Métodos de pago</label>
            <input style={{ marginRight: 8 }}
              type="string"
              value={paymentMethods}
              onChange={(e) => setPaymentMethods(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Teléfono con Nequí</label>
            <input style={{ marginRight: 8 }}
              type="string"
              value={referenceForPayment}
              onChange={(e) => setReferenceForPayment(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Nombre asociado al teléfono con Nequí</label>
            <input style={{ marginRight: 8 }}
              type="string"
              value={nameForPayment}
              onChange={(e) => setNameForPayment(e.target.value)}
            ></input>
          </div>
          <div>
            <Button type="primary" shape="round" onClick={handleClick}>
            Crear un anuncio
            </Button>
          </div>
        </div>
          ) : (
            <div className="add-ad__error">Conecte la billetera</div>
            )}
      <ReactJson src={data} name="response" theme="ocean" />
      </div>
      );
}

