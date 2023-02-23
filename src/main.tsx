import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://intercambiador.pasosdeJesus.org/tonconnect-manifest.json';

console.log("inicializa?");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider 
    manifestUrl={manifestUrl}
    /*getConnectParameters={async () => {
        const tonProof = await tonProofPayloadPromise; // will be executed every time when wallets modal is opened. It is recommended to make an http-request in advance
        return {
          tonProof
        };
    }} */
  >
    <App />
  </TonConnectUIProvider>,
)
