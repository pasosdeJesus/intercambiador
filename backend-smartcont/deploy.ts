/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { Cell, TonClient, Slice, WalletContractV4 } from "ton";
import { Address, Dictionary } from "ton-core";
import AdsContract from "./ads_contract"; 

async function deploy() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // prepare AdsContract's initial code and data cells for deployment
  const adsContractCode = Cell.fromBoc(
    fs.readFileSync("./ads_contract.cell")
  )[0];

  if (typeof process.env.MANAGER_SECRET24 == "undefined") {
    console.error("Must define MANAGER_SECRET24");
    process.exit(1);
  }

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MANAGER_SECRET24;
  const keypair = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create(
    { publicKey: keypair.publicKey, workchain: 0 }
  );

  const manager_address = Address.parse(
    process.env.MANAGER_ADDRESS || "EQBw2alYCpBVSZsuxBV92akZdfKqU4u8upAU6nyx-Lv6rh81"
  );
  const public_key = keypair.publicKey;
  const fund_address = Address.parse(
    process.env.HANDSFORSIERRALEONE_ADDRESS || "EQBW-VzrrQgUZCKonQm3gHqDFUK42yM33k3g6zMpvvq7tcCj"
  );
  const fund_percentage = 10;
  const selling_ads = Dictionary.empty<Address, Cell>();
  const buying_ads = Dictionary.empty<Address, Cell>();
  const payments_buying_ads = Dictionary.empty<Address, Cell>();
  const adsContract = AdsContract.createForDeploy(
    adsContractCode, manager_address, public_key, 1, 
    fund_address, fund_percentage,
    selling_ads, buying_ads, payments_buying_ads
  );

  // exit if contract is already deployed
  console.log("contract address:", adsContract.address.toString());
  if (await client.isContractDeployed(adsContract.address)) {
    return console.log("AdsContract already deployed");
  }

  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(keypair.secretKey);
  const seqno = await walletContract.getSeqno();

  // send the deploy transaction
  const adsContractContract = client.open(adsContract);
  await adsContractContract.sendDeploy(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for deploy transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("deploy transaction confirmed!");
}

deploy();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
