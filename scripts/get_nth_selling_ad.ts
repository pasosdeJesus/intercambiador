import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { Address, Cell } from "ton-core";
import AdsContract from "./ads_contract"; 
import * as AdsConstants from "./ads_constants"; 

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

async function main(argv:Array<string>) {

  if (argv.length != 3) {
    console.error("Falta número de anuncio como primer parámetro");
    process.exit(1);
  }
  let num = +argv[2];

  if (!AdsContract.validConfiguration()) {
    console.log("Configuration is not valid, improve ../.env");
    process.exit(1);
  }

  const endpoint = await getHttpEndpoint({ network: AdsConstants.tonNetwork  });
  const client = new TonClient({ endpoint });

  const adsAddress = Address.parse(AdsConstants.adsContractAddress); 
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);

  try {
    const anuncio = await adsContract.getNthSellingAd(num);
    let direccion = anuncio[0].toString();
    if (typeof anuncio[0] == "object") {
      direccion = Address.normalize(anuncio[0]); //hash.toString("hex");
    }
    console.log(JSON.stringify({ anuncioventa: {
      direccion:  direccion,
      cantidad: Number(anuncio[1]),
      valido_hasta: Number(anuncio[2])
    }}))
  } catch(e) {
    console.log("Cannot get selling add number " + num);
  }
}

main(process.argv);

