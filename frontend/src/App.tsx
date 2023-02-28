import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract'; 
import { CHAIN } from "@tonconnect/protocol";
import { Counter } from "./components/Counter";
import { AdsList } from "./components/AdsList";
import { ExampleQueryGithub } from "./components/ExampleQueryGithub";

function App() {

  const { connected, network, wallet, depura, reporta } = useTonConnect();

  return (
    <div className="App">
      <div className="encabezado">
        <img src="/logo.png" className="logo" alt="Intercambiador COP - TON" />
        <h1>Intercambiador COP - TON</h1>
      </div>
      <div className="derecha" style={{display: 'flex', flexDirection: 'column', flexAlign: "flex-end"}}>
        <TonConnectButton />
        <div className="network" style={{display: 'block'}}>
          {network ? (network === CHAIN.MAINNET ? "mainnet" : "testnet") : 
            "N/D"
          }
        </div>
      </div>
      <AdsList />
    </div>
  );
}

export default App;
