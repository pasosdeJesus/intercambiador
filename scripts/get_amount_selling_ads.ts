import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { Address, Cell } from "ton-core";
import AdsContract from "./ads_contract"; 
import * as AdsConstants from "./ads_constants"; 

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

async function main(argv:Array<string>) {

  if (!AdsContract.validConfiguration()) {
    console.log("Configuration is not valid, improve ../.env");
    process.exit(1);
  }

  const endpoint = await getHttpEndpoint({ network: AdsConstants.tonNetwork });
  //console.log("endpoint=", endpoint);
  const client = new TonClient({ endpoint });

  const adsAddress = Address.parse(AdsConstants.adsContractAddress); 
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);

  try {
    const n = await adsContract.getAmountSellingAds();
    console.log({amount: Number(n)});
  } catch(e) {
    console.log("Cannot get amount of selling ads");
  }
}

main(process.argv);

