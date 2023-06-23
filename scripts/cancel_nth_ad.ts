import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

import { Address, Cell } from "ton-core";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4 } from "ton";

import * as AdsConstants from "./ads_constants"; 
import AdsContract from "./ads_contract"; 

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

  const keypair = await mnemonicToWalletKey(
    AdsConstants.managerSecret24.split(" "));

  const wallet = WalletContractV4.create({ 
    publicKey: keypair.publicKey,
    workchain: 0
  });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(keypair.secretKey);
  const seqno = await walletContract.getSeqno();
  console.log("manager wallet seqno:", seqno.toString());

  try {
    const anuncio = await adsContract.getNthSellingAd(num);
    let direccion = anuncio[0].toString();
    if (typeof anuncio[0] == "object") {
      direccion = Address.normalize(anuncio[0]); //hash.toString("hex");
    }
    const direccion2 = Address.parse(direccion); 
 
    console.log("Dirección del anuncio " + num + ": " + direccion)
    const msg = await AdsContract.prepareManagerCancelsSellingAd(direccion2)
    await adsContract.sendPreparedMessage(msg, 0.2, walletSender);

    // wait until confirmed by wallet
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      console.log("waiting for wallet to confirm...");
      await sleep(1500);
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("sending confirmed by wallet!");
  } catch(e) {
    console.log("Cannot cancel selling add number " + num);
  }
}

main(process.argv);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
