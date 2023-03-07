#!/bin/sh

if (test ! -f .env) then {
  echo "Missing .env file. Copy .env.plantilla in .env and change it"
  exit 1;
} fi;

. .env

# According to
# https://security.stackexchange.com/questions/262106/crack-jwt-hs256-with-hashcat
# HS256 is secure (hard to find the secret) when the secret has more
# than 128 bits of entropy. We choose 256 bits randonmly
export HS256_SECRET=`od -vAn -N32 -ta < /dev/urandom | tr -d ' ' | tr -d '\n'`
echo "HS256_SECRET: ${HS256_SECRET}"

foreman start -f Procfile

