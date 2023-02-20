import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract'; 

function App() {

  const { connected, depura, reporta } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  /*depura(); */
  reporta(); 
  
  return (
    <div className="App">
      <div className="encabezado">
        <img src="/logo.png" className="logo" alt="Intercambiador COP - TON" />
        <h1>Intercambiador COP - TON</h1>
      </div>
      <div className="derecha">
        <TonConnectButton />
      </div>
      <div className="Container">
        <div className='Card'>
          <b>Dirección del contador</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Valor del Contador</b>
          <div>{value ?? 'Cargando...'}</div>
        </div>
      </div>

      <a className={`Button ${connected ? 'Active' : 'Disabled'}`}
        onClick={() => {
          sendIncrement();
        }}
      >
       Increment
      </a>
    </div>
  );
}

export default App
