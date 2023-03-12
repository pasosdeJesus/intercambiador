/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "ton";
import AdsContract from "./ads_contract"; 

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  const adsAdress = Address.parse("EQAAxvF5NLtW4Dk0Ntgfhy_Xlbc63-p-M0vzrTwlrjxcomO5"); 
  const ads = new AdsContract(adsAdress);
  const adsContract = client.open(ads);

  // call the getter on chain
  const adsSeqno= await adsContract.getSeqno();
  console.log("seqno:", adsSeqno.toString());
  const adsManagerAddress= await adsContract.getManagerAddress();
  console.log("manager_address:", adsManagerAddress.toString());
  const adsPublicKey= await adsContract.getPublicKey();
  console.log("public_key:", adsPublicKey.toString());

}

main();

