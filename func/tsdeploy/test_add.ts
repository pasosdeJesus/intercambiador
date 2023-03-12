/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "ton";
import AdsContract from "./ads_contract"; 

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (typeof process.env.CONTRACT_ADDRESS == "undefined") {
    return console.log("Missing variable CONTRACT_ADDRESS");
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

  const adsAdress = Address.parse(process.env.CONTRACT_ADDRESS); 
  const ads = new AdsContract(adsAdress);
  const adsContract = client.open(ads);

  const adsManagerAddress= await adsContract.getManagerAddress();
  if (adsManagerAddress != wallet.address) {
    return console.log("Manager address and wallet address differ");
  }
  const adsPublicKey= await adsContract.getPublicKey();
  if (adsPublicKey != keypair.publicKey) {
    return console.log("Public key in contract different to public key of wallet");
  }

  // call the getter on chain
  const adsSeqno= await adsContract.getSeqno();
  console.log("seqno:", adsSeqno.toString());

  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(keypair.secretKey);
  const seqno = await walletContract.getSeqno();

  await adsContract.sendIncrement(walletSender, keypair, adsSeqno);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
