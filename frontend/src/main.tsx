import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { QueryClient, QueryClientProvider } from "react-query";

const manifestUrl = 'https://intercambiador.pasosdeJesus.org/tonconnect-manifest.json';

console.log("inicializa?");

const queryClient = new QueryClient();
/*{
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
}); */

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
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </TonConnectUIProvider>,
)
