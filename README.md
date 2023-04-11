# Intercambiador COP - TON

## Requirements

This is an implementantion of a P2P market to buy or sell TON with the 
colombian currency.

You can see requirements, viability analysys and roadmap at:
<https://docs.google.com/document/d/1JtmHp5SPsHglGwQJYlQSabMryCY6QzM-07OdDsJWrYw/edit?usp=sharing>


## Current status 

You can see a very crude demo at <https://intercambiador.pasosdeJesus.org>,
by using TonKeeper it just works with Ton-Connect 2.0 and uses the 
authentication backend to login and after the database backend to query 
the ads in the database --both backends are coordinated for authentication 
first with TonProof and then with JSON Web Tokens by using a common secret 
used to encrypt and decrypt the address of the wallet that connects.

Neither the frontend nor the backends still interact with the smart contract,
although an advanced version of the smart contract is already deployed
(see address in .env.plantilla).

The deployed smart contract can be tested with the scripts available at 
`scripts` to query it and to add an example Ad of the manager.


## Organization

Directories:
* func: Smart contract to manage list of ads and their coins and its tests
* scripts: Scripts to deploy the smart contract and to use it from command line
* backend-auth: In Go manages authentication with Ton Connect 2.0
* backend: In Ruby on Rails manages database
* frontend: It uses backend and backend-auth


## Steps to run the demo

### Prepare environment variables

The environment variables must be defined in the file `.env` of this directory.
You can start it by `cp .env.plantilla .env` and fill with your values.

### Prepare and deploy the smart contract

In directory `func`, improve and add tests, ensuring that they run with 
`make` (check instructions in `func/README.md`).
After in directory `backend-smartcont` deploy to chain the smartcontract 
configured with the environment variables and test it (check instrucions
in `backed-smartcont/README.md`).

### Run the backends and the frontend

It is done with the script `bin/run.sh` that generates a random secret
(in the variable `HS256_SECRET`) for the JWT tokens coordinated between
the authentication backend and the database backend and starts both
backends and the frontend in development mode.

To run these 3 processes yo need to install globally the gem `foreman` 
(on adJ/OpenBSD it would be with `doas gem install foreman`).
`foreman` should be run with the configuration file `Procfile`.

The file `Procfile` specifies how to start each process:
  * The backend in ruby runs in one port (e.g 3442 unencrypted and then
    encrypted with an nginx proxy for example in 3443).  You can
    see specific instructions in `backend/README.md`
  * The backend in go runs in another port (e.g 8081 unencrypted and encrypted
    with an nginx proxy for example in 4443).  Check specific instructions
    in `backend-auth/README.md`
  * The development server of the frontend runs unencrypted in other
    port (e.g unencrypted in 5173 and encrypted with an nginx proyx 
    in another port e.g 443).  Check instructions in `frontend/README.md`


