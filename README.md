# Intercambiador COP - TON

You can see requirements at:
<https://docs.google.com/document/d/1JtmHp5SPsHglGwQJYlQSabMryCY6QzM-07OdDsJWrYw/edit?usp=sharing>


Directories:
* func: Smart contract to manage list of ads and their coins and its tests
* backend-smartcont: Scripts to deploy the smart contract and to use it
* backend-auth: In Go manages authentication with Ton Connect 2.0
* backend: In Ruby on Rails manages database, it uses backend-ts
* frontend: It uses backend and backend-auth


# Prepare environment variables

The environment variables must be defined in the file `.env` of this directory.
You can start it by `cp .env.plantilla .env` and fill with your values.

# Prepare and deploy the smart contract

In directory func, improve and add tests, ensuring that they run with make.
After in directory tsdeploy deploy to chain the smartcontract configured
with the environment variables.

# Run the backends and the frontend

It is done with the script `bin/run.sh` that generates a random secret
(in the variable `HS256_SECRET`) for the JWT tokens coordinated between
the authentication backend and the database backend and starts both
backends and the frontend in development mode.

To run these 3 processes it is required to install `foreman` that uses the file
`Procfile`.

The file `Procfile` specifies how this is done:
  * The backend in ruby runs in one port (e.g 3442 unencrypted and with 
    encrypted with nginx proxy for example in 3443).
  * The backend in go runs in another port (e.g 8081 unencrypted and encrypted
    with nginx proxy for example in 4443).
  * The development server of the frontend runs unencrypted in other
    port 5173, and encrypted with an nginx proyx in another port e.g 443.


