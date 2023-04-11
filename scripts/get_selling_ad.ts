import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { Address, Cell } from "ton-core";
import AdsContract from "./ads_contract"; 
import * as AdsConstants from "./ads_constants"; 

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

async function main(argv:Array<string>) {

  if (argv.length != 3) {
    console.error("Falta dirección como primer parámetro");
    process.exit(1);
  }
  let direccion = argv[2];

  if (!AdsContract.validConfiguration()) {
    console.log("Configuration is not valid, improve ../.env");
    process.exit(1);
  }

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  //console.log("endpoint=", endpoint);
  const client = new TonClient({ endpoint });

  const adsAddress = Address.parse(AdsConstants.adsContractAddress); 
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);


  const address = Address.parse(direccion); 
  //console.log("address=", address);
  try {
    const d = await adsContract.getSellingAd(address);
    console.log({coins: d[0], valid_until: d[1]});
  } catch(e) {
    console.log("Possibly address doesn't have a selling ad");
  }
}

main(process.argv);

