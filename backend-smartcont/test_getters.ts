/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "ton";
import AdsContract from "./ads_contract"; 

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (typeof process.env.ADSCONTRACT_ADDRESS == "undefined") {
    console.error("Must define ADSCONTRACT_ADDRESS");
    process.exit(1);
  }

  const adsAddress = Address.parse(process.env.ADSCONTRACT_ADDRESS); 
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);

  // call the getters on chain
  const adsSeqno= await adsContract.getSeqno();
  console.log("seqno:", adsSeqno.toString());
  const adsManagerAddress= await adsContract.getManagerAddress();
  console.log("manager_address:", adsManagerAddress.toString());
  const adsPublicKey= await adsContract.getPublicKey();
  console.log("Manager public_key:", adsPublicKey.toString());

  //const sellingAdAddresses = await adsContract.getSellingAdAddresses();
  //console.log("sellingAdAddresses:", sellingAdAddresses.toString());

  //const sellingAd = await adsContract.getSellingAd(adsAddress);
  //console.log("sellingAdAddresses:", sellingAd.toString());
}

main();

