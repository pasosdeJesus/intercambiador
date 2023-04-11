//import { useTonConnect } from '../hooks/useTonConnect';
import { useTonWallet } from '../hooks/useTonWallet';
import { Button, Typography } from 'antd'
import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import ReactJson from 'react-json-view';
import axios from "axios";
import { CHAIN } from "@tonconnect/protocol";
import { Ad } from "./Ad";
import { TonProofApi } from '../TonProofApi';

export function AdsList () {
  //const { connected, network, wallet, depura, reporta } = useTonConnect();
  const [data, setData] = useState({});

  const wallet = useTonWallet();
  const handleClick = useCallback(async () => {
    if (!wallet) {
      return;
    }
    console.log("wallet.account=", wallet.account)
    const response = await TonProofApi.getSellingAdsList(wallet.account);
    console.log("response=", response);

    setData(response);
  }, [wallet]);


  if (!wallet) {
    return (
      <div className="Container">
      <div>Desconectado</div>
      </div>
    );
  }

  let anuncios = Array(0);
  if (typeof data == 'object' && data != {} && (typeof data.map == "function")) {
    anuncios = data.map((anuncio) => (
      <Ad key={anuncio.id} 
      ton={anuncio.ton} 
      floatingmargin={anuncio.margenflotante}
      lowerlimit={anuncio.limiteinferior}
      user_id={anuncio.usuario_id} />
    ))
  }

  return (
      <div className="ton-proof-demo">
      {wallet ? (
          <Button type="primary" shape="round" onClick={handleClick}>
            Ver Anuncios de venta
          </Button>
          ) : (
            <div className="ton-proof-demo__error">Conecte la billetera para llamar el API</div>
            )}
      <ul>{anuncios}</ul>
      </div>
      );
      /*<ReactJson src={data} name="response" theme="ocean" /> */
/*  console.log(wallet);
  return (
    <div className="Container">
    <h1>Anuncios</h1>
    <ul>{anuncios}</ul>
    </div>
  ); */
/*        <div className="network" style={{display: 'block'}}>
        <p>Red: {JSON.stringify(network)}</p>
          {network ? (network === CHAIN.MAINNET ? "mainnet" : "testnet") : 
            "N/D" }
        </div> */

}
