/*
 * References: 
 * https://ton-community.github.io/tutorials/02-contract/
 */

import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "ton";
import AdsContract from "./ads_contract"; 
import * as AdsConstants from "./ads_constants"; 

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  console.log("endpoint=", endpoint);
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
  
  const managerAddress = Address.parse(AdsConstants.managerAddress); 
  try {
    const d = await adsContract.getSellingAd(managerAddress);
    console.log("selling ad of manager:", d);
  } catch(e) {
    console.log("Possibly manager doesn't have a selling ad");
  }

  const amount:BigInt = await adsContract.getAmountSellingAds();
  console.log("amount of selling ads:", amount);

  for (let r = 0; r < Number(amount); r++) {
    const datsa = await adsContract.getNthSellingAd(r);
    console.log("data of selling ad", r, " is ", datsa);
  }




}

main();

