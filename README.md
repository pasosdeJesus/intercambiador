# Intercambiador COP - TON

You can see requirements at:
<https://docs.google.com/document/d/1JtmHp5SPsHglGwQJYlQSabMryCY6QzM-07OdDsJWrYw/edit?usp=sharing>


Directories:
* func: Smart contract to manage list of ads and their coins and its tests
* backend-smartcont: Scripts to deploy the smart contract and to use it
* backend-auth: In Go manages authentication with Ton Connect 2.0
* backend: In Ruby on Rails manages database, it uses backend-ts
* frontend: It uses backend and backend-auth


The environment variables must be defined in the file `.env` of this directory.
You can start it by `cp .env.plantilla .env` and fill with your values.

In each directory you will find a README.md to help you


