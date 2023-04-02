
import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "ton";
import * as AdsConstants from "./ads_constants"; 
import AdsContract from "./ads_contract"; 

/* Based on
 * https://stackoverflow.com/questions/52595180/how-to-read-write-a-bigint-from-buffer-in-node-js-10
 */
function bufferToBigInt(buffer: Buffer, start = 0, end = buffer.length) {
  const bufferAsHexString = buffer.slice(start, end).toString("hex");
  return BigInt(`0x${bufferAsHexString}`);
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: AdsConstants.tonNetwork });
  const client = new TonClient({ endpoint });

  if (typeof process.env.ADSCONTRACT_ADDRESS== "undefined") {
    return console.log("Missing variable ADSCONTRACT_ADDRESS");
  }
  if (typeof process.env.MANAGER_SECRET24 == "undefined") {
    return console.log("Missing variable MANAGER_SECRET24");
  }

  // open manWallet v4 (notice the correct manWallet version here)
  const keypair = await mnemonicToWalletKey(
    AdsConstants.managerSecret24.split(" ")
  );
  const manWallet = WalletContractV4.create({ 
    publicKey: keypair.publicKey,
    workchain: 0 
  })
  if (!await client.isContractDeployed(manWallet.address)) {
    return console.log("manWallet is not deployed");
  }
  const manWalletContract = client.open(manWallet);
  const manWalletSender = manWalletContract.sender(keypair.secretKey);

  const adsAddress = Address.parse(AdsConstants.adsContractAddress);
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);

  const adsManagerAddress= await adsContract.getManagerAddress();
  if (adsManagerAddress.toString() != manWallet.address.toString()) {
    return console.log(
      `Address of manager in ads contract (${adsManagerAddress}) ` +
        `and manWallet address (${manWallet.address}) differ`
    );
  }
  const adsPublicKey= await adsContract.getPublicKey();
  if (adsPublicKey != bufferToBigInt(keypair.publicKey)) {
    return console.log(
      "Public key in ads contract is different to public key of manager"
    );
  }

  // call the getter on chain
  const msg = await AdsContract.prepareSellingAd();
  await adsContract.sendPreparedMessage(msg, 5.6, manWalletSender);

  const seqno = await manWalletContract.getSeqno();
  console.log("manager manWallet seqno:", seqno.toString());

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm (if not confirmed after 5 seconds check you have more than 5.6 TON in manager wallet)...");
    await sleep(1500);
    currentSeqno = await manWalletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
