#!/bin/sh

if (test ! -f .env) then {
  echo "Missing .env file. Copy .env.plantilla in .env and change it"
  exit 1;
} fi;

. .env

foreman start -f Procfile

