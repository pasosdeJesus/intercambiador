/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

export function ExampleQueryGithub() {
  const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
    axios.get(
      "https://intercambiador.pasosdejesus.org:3443/anuncios.json"
    ).then((res) => res.data)
  );

  if (isLoading) return "Cargando...";

  if (error) return "Ocurrió un error: " + error.message;

  return (
    <div>
      <h1>Anuncios</h1>
      <p>{typeof data}{JSON.stringify(data)}</p>
      <div>{isFetching ? "Actualizando..." : ""}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

