import './App.css'
import React, { useEffect } from 'react';
import { AuthButton } from './components/AuthButton/AuthButton';
import { connector } from './connector';
import { TonProofDemo } from './components/TonProofDemo/TonProofDemo'; 
//import { AdsList } from "./components/AdsList";
//import { useQuery } from "react-query";
//import axios from "axios";


export default function App() {

  useEffect( () => { connector.restoreConnection(); }, []);

  return (
    <div className="App">
      <header>
        <div className="encabezado">
          <img src="/logo.png" className="logo" alt="Intercambiador COP - TON" />
          <h1>Intercambiador COP - TON</h1>
        </div>
        <div className="derecha" style={{display: 'flex', flexDirection: 'row'}}>
          <AuthButton />
        </div>
      </header>
      <main>
        <TonProofDemo />
      </main>
    </div>
  );
        //<AdsList />
}
