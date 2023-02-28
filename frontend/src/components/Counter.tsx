import { useCounterContract } from '../hooks/useCounterContract'; 
import { useTonConnect } from '../hooks/useTonConnect';


export function Counter() {
  const { connected, network, wallet, depura, reporta } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  reporta();

  return (
    <div className="Container">
      <div className='Card'>
        <b>Dirección del contador</b>
        <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
      </div>

      <div className='Card'>
        <b>Valor del Contador</b>
        <div>{value ?? 'Cargando...'}</div>
      </div>
      <a className={`Button ${connected ? 'Active' : 'Disabled'}`}
        onClick={() => { sendIncrement(); }}
      >
        Incrementar
      </a>
    </div>
  );
}
