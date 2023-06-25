import './App.css'
import React, { useEffect } from 'react';
import { AuthButton } from './components/AuthButton/AuthButton';
import { connector } from './connector';
import { TonProofDemo } from './components/TonProofDemo/TonProofDemo'; 
import { AdsList } from "./components/AdsList";
import { AddAd } from "./components/AddAd";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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
          <Tabs>
            <TabList>
              <Tab>Anuncios de venta</Tab>
              <Tab>Crear anuncio de venta</Tab>
            </TabList>
            <TabPanel>
              <AdsList />
            </TabPanel>
            <TabPanel>
              <AddAd />
            </TabPanel>
          </Tabs>
        </main>
        <footer>
        </footer>
      </div>
  );
          //<TonProofDemo />
}
