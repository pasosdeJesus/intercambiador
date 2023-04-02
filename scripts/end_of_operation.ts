import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "ton";
import AdsContract from "./ads_contract"; 

/* Based on
 * https://stackoverflow.com/questions/52595180/how-to-read-write-a-bigint-from-buffer-in-node-js-10
 */
function bufferToBigInt(buffer: Buffer, start = 0, end = buffer.length) {
  const bufferAsHexString = buffer.slice(start, end).toString("hex");
  return BigInt(`0x${bufferAsHexString}`);
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (typeof process.env.ADSCONTRACT_ADDRESS== "undefined") {
    return console.log("Missing variable ADSCONTRACT_ADDRESS");
  }
  if (typeof process.env.MANAGER_SECRET24 == "undefined") {
    return console.log("Missing variable MANGER_SECRET24");
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MANAGER_SECRET24;
  const keypair = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ 
    publicKey: keypair.publicKey,
    workchain: 0 
  });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  const adsAddress = Address.parse(process.env.ADSCONTRACT_ADDRESS); 
  const ads = new AdsContract(adsAddress);
  const adsContract = client.open(ads);

  const adsManagerAddress= await adsContract.getManagerAddress();
  if (adsManagerAddress.toString() != wallet.address.toString()) {
    return console.log(`Manager address (${adsManagerAddress}) and wallet address (${wallet.address}) differ`);
  }
  const adsPublicKey= await adsContract.getPublicKey();
  if (adsPublicKey != bufferToBigInt(keypair.publicKey)) {
    return console.log("Public key in contract different to public key of wallet");
  }

  // call the getter on chain
  const adsSeqno= await adsContract.getSeqno();
  console.log("ads seqno:", adsSeqno.toString());

  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(keypair.secretKey);
  const seqno = await walletContract.getSeqno();
  console.log("manager wallet seqno:", seqno.toString());

  await adsContract.sendEndOfOperation(keypair, adsSeqno, walletSender);

  // wait until confirmed by wallet
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for wallet to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("sending confirmed by wallet!");
}

main();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
