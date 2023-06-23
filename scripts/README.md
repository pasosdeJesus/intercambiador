# Scripts to deploy the smart contract and to use it from frontend/backend

To prepare run
```
yarn
```

## Generate Cell

To generate a cell in `ads_contract.cell` with the smart contract
`../func/func/ads_contract.fc` compiled,  run:
```
yarn cell
```
## Deploy Smart Contract

To deploy that cell fill in .env the variables

export MANAGER_SECRET24="pattern ... trap"

export MANAGER_ADDRESS="E...n"

export HANDSFORSIERRALEONE_ADDRESS="E..k"

and then run:
```
yarn deploy
```

Put the address generated in `../.env` in the variable `ADSCONTRACT_ADDRESS`


## Library for Javascript

The files `ads_constants.ts` and `ads_contract.ts` are like a library
in TypeScript to operate the FunC contract.


## Tests the library onchain

Run
```
yarn test
```
This will call the getters of the contract onchain.

To test adding an ad as manager (with more than 5.6 TON in wallet) run:
```
npx ts-node test_add_selling_ad
```
After you can check with an explorer that the ads contract gave utilites
to the manager (around 0.5) and to the fund (around 0.05).

If you run `yarn test`  you should be able to see an ad from manager.


## Scripts

| Script | What it does |
| npx ts-node end_of_operation | Ends operation of contract returing coins and destroying contract |
| npx ts-node prepare_selling_ad | Backend uses this to generate a message signed by manager to create a selling ad with the right seqno |
```
