import React from "react";

let pesos = (n) => {
  let p = Math.round(n);
  return "$ " + p.toLocaleString('es-CO');
}


export function Ad(props) {
  let ppt = pesos(props.pesosporton);
  let lmin = pesos(props.lowerlimit*props.pesosporton);
  let lmax = pesos(props.ton*props.pesosporton);
  return (
    <li className="ad stack-small">
      <div className="c-cb">
        <div>{ppt}</div>
        <hr/>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div>{props.nombrecomercial}</div>
        </div>
        <div>Límites: {lmin} a {lmax}</div>
        <div>Metodos de pago: {props.metodosdepago.join(', ')}</div>
        <div>Validez: {props.pesosporton_validez}</div>
      <div className="btn-group">
        <button type="button" className="btn">
          Comprar
        </button>
      </div>
      </div>
    </li>
  );
}
