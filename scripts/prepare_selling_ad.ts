import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { Cell } from "ton-core";
import AdsContract from "./ads_contract"; 
import * as AdsConstants from "./ads_constants"; 

async function main() {

  //if (process.argv.count != 1) {
  //  console.err("Falta cantidad de monedas como primer argumento");
  //}
  //const coins = +process.argv[0]

  if (!AdsContract.validConfiguration()) {
    console.log("Configuration is not valid, improve ../.env");
    process.exit(1);
  }

  const msgBody = await AdsContract.prepareSellingAd();
  const buf = msgBody.toBoc()
  const bufhex = buf.slice(0, buf.length).toString("hex");
  console.log("bochex: ", bufhex);
}

main();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
