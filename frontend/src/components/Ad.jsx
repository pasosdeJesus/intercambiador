import React from "react";

export function Ad(props) {

  return (
    <li className="ad stack-small">
      <div className="c-cb">
         <input id="{props.id}" type="checkbox" defaultChecked={true} />
         <label className="todo-label" htmlFor="todo-0">
           {props.ton} - {props.floatingmargin} - {props.lowerlimit} - {props.user_id}
         </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn">
          Comprar
        </button>
      </div>
    </li>
  );
}
