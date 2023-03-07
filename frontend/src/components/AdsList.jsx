//import { useTonConnect } from '../hooks/useTonConnect';
import React from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";
import { CHAIN } from "@tonconnect/protocol";
import { Ad } from "./Ad";

export function AdsList () {
//  const { connected, network, wallet, depura, reporta } = useTonConnect();

  const connected = false; /* OJO remplazar */
  const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
    axios.get(
      "https://intercambiador.pasosdejesus.org:3443/anuncios.json"
    ).then((res) => res.data)
  );

  if (isLoading) return (<div>Cargando...</div>);

  if (error) return (<div>Ocurrió un error: {error.message}</div>);

  //const { data } = useAdsList();

  //reporta()

  if (connected) {

    let anuncios = [];
    if (typeof data == 'object') {
      anuncios = data.map((anuncio) => (
        <Ad key={anuncio.id} 
          ton={anuncio.ton} 
          floatingmargin={anuncio.margenflotante}
          lowerlimit={anuncio.limiteinferior}
          user_id={anuncio.usuario_id} />
        )
      )
    }
    return (
      <div className="Container">
        <h1>Anuncios</h1>
        <p>Connected: {JSON.stringify(connected)}</p>
        <p>Billetera: {JSON.stringify(wallet)}</p>
        <p>Red: {JSON.stringify(network)}</p>
        <ul>{anuncios}</ul>
      </div>
    );
/*        <div className="network" style={{display: 'block'}}>
          {network ? (network === CHAIN.MAINNET ? "mainnet" : "testnet") : 
            "N/D" }
        </div> */

  } else {
    return (
      <div className="Container">
        <div>Desconectado</div>
      </div>
    );
  }
}
