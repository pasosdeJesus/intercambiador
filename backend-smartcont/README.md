# Scripts to deploy the smart contract and to use it from the backend

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

Put the address generated in ../.env in the variable `ADSCONTRACT_ADDRESS`


## Tests

Run
```
yarn test
```
This will call the getters of the contract onchain.

To add an ad as manager run:
```
npx ts-node test_add_selling_ad"
```
