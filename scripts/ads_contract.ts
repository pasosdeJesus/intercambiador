/*
 * References
 * https://ton-community.github.io/tutorials/02-contract/
 */

import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  Contract,
  ContractProvider,
  Dictionary,
  Sender,
  Slice,
  TupleItem,
  TupleItemInt
} from "ton-core";
import {
  KeyPair,
  keyPairFromSeed,
  mnemonicToPrivateKey,
  mnemonicToWalletKey,
  sign
} from "ton-crypto";
import {
  TonClient,
  WalletContractV4
} from "ton";
import { 
  getHttpEndpoint 
} from "@orbs-network/ton-access";
import * as AdsConstants from "./ads_constants";
import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

export default class AdsContract implements Contract {

  // DEPLOYMENT
  // ------------------------------------------------------------

  static createForDeploy(
    code: Cell,
    seqno: number,
    selling_ads: Dictionary<Address, Cell>,
    buying_ads: Dictionary<Address, Cell>,
    payments_buying_ads: Dictionary<Address, Cell>,
  ): AdsContract {
    const data = beginCell()
    .storeUint(seqno, 32)
    .storeDict(selling_ads)
    .storeDict(buying_ads)
    .storeDict(payments_buying_ads)
    .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new AdsContract(address, { code, data });
  }

  constructor(
    readonly address: Address, readonly init?: { code: Cell, data: Cell }
  ) {}

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }

  // PREPARING MESSAGES WITH OPERATIONS TO PERFORM
  // ------------------------------------------------------------

  static async prepareSellingAd() {
    const manKeypair = await mnemonicToWalletKey(
      AdsConstants.managerSecret24.split(" ")
    );

    const adsAddress = Address.parse(AdsConstants.adsContractAddress);
    const ads = new AdsContract(adsAddress);
    const endpoint = await getHttpEndpoint(
      { network:  AdsConstants.tonNetwork }
    );
    const client = new TonClient({ endpoint });
    const adsContract = client.open(ads);

    const adsSeqno= await adsContract.getSeqno();

    const bodyToSign = beginCell()
      .storeUint(adsSeqno, 32)
      .storeUint(AdsConstants.opSellerCreatesAd, 32)
      .endCell();

    const hash = bodyToSign.hash();

    const signature = sign(hash, manKeypair.secretKey);

    const messageBody = beginCell()
    .storeBuffer(signature)
    .storeRef(bodyToSign)
    .endCell();

    return messageBody;
  }

  static async prepareManagerCancelsSellingAd(address: Address) {
    const manKeypair = await mnemonicToWalletKey(
      AdsConstants.managerSecret24.split(" ")
    );

    const adsAddress = Address.parse(AdsConstants.adsContractAddress);
    const ads = new AdsContract(adsAddress);
    const endpoint = await getHttpEndpoint(
      { network:  AdsConstants.tonNetwork }
    );
    const client = new TonClient({ endpoint });
    const adsContract = client.open(ads);

    const adsSeqno= await adsContract.getSeqno();

    const bodyToSign = beginCell()
      .storeUint(adsSeqno, 32)
      .storeUint(AdsConstants.opManagerCancelsSellingAd, 32)
      .storeAddress(address)
      .endCell();

    const hash = bodyToSign.hash();

    const signature = sign(hash, manKeypair.secretKey);

    const messageBody = beginCell()
    .storeBuffer(signature)
    .storeRef(bodyToSign)
    .endCell();

    return messageBody;
  }


  static async prepareEndOfOperation() {
    const manKeypair = await mnemonicToWalletKey(
      AdsConstants.managerSecret24.split(" ")
    );

    const adsAddress = Address.parse(AdsConstants.adsContractAddress);
    const ads = new AdsContract(adsAddress);
    const endpoint = await getHttpEndpoint(
      { network:  AdsConstants.tonNetwork }
    );
    const client = new TonClient({ endpoint });
    const adsContract = client.open(ads);

    const adsSeqno= await adsContract.getSeqno();

    const bodyToSign = beginCell()
      .storeUint(adsSeqno, 32)
      .storeUint(AdsConstants.opManagerEndsOperation, 32)
      .endCell();

    const hash = bodyToSign.hash();

    const signature = sign(hash, manKeypair.secretKey);

    const messageBody = beginCell()
    .storeBuffer(signature)
    .storeRef(bodyToSign)
    .endCell();

    return messageBody;
  }

  // SENDING MESSAGES
  // ------------------------------------------------------------

  async sendPreparedMessage(
    provider: ContractProvider, messageBody: Cell, coins: number, via: Sender
  ) {
    await provider.internal(via, {
      value: coins.toString(),  // Needs at least 0.005 because checks signature, with 0.002 produced error -14, out of gas
      body: messageBody
    });
  }

  // GETTERS
  // ------------------------------------------------------------

  async getManagerAddress(provider: ContractProvider) {
    const { stack } = await provider.get("get_manager_address", []);
    return stack.readAddress();
  }

  async getPublicKey(provider: ContractProvider) {
    const { stack } = await provider.get("get_public_key", []);
    return stack.readBigNumber();
  }

  async getSeqno(provider: ContractProvider) {
    const { stack } = await provider.get("seqno", []);
    return stack.readBigNumber();
  }

  async getSellingAdAddresses(provider: ContractProvider) {
    const { stack } = await provider.get("get_selling_ad_addresses", []);
    return stack.readTuple();
  }


  /* address must be converted to TupleItem  */
  async getSellingAd(provider: ContractProvider, address: Address) {
    const c = beginCell()
    .storeAddress(address)
    .endCell();

    const { stack } = await provider.get(
      "get_selling_ad",
      [{ type: 'slice', cell: c}]
    );
    return [stack.readBigNumber(), stack.readBigNumber()];
  }

  /* No soportado aún por ton-core
  async getAds(provider: ContractProvider) {
    const { stack } = await provider.get("get_ads", []);
    return stack.readCellOpt();
  } */

  async getAmountSellingAds(provider: ContractProvider) {
    const { stack } = await provider.get("get_amount_selling_ads", []);
    return stack.readBigNumber();
  }

  async getNthSellingAd(provider: ContractProvider, nt: number) {
    const { stack } = await provider.get(
      "get_nth_selling_ad", [{ type: 'int', value: BigInt(nt) }]
    );
    return [stack.readAddress(), stack.readBigNumber(), stack.readBigNumber()];
  }

  // MISC
  // ------------------------------------------------------------

  static validConfiguration():Boolean {
    let valid = true;
    if (typeof process.env.TON_NETWORK == "undefined") {
      console.log("Missing variable TON_NETWORK should be testnet or mainnet");
      valid = false;
    }
    if (typeof process.env.ADSCONTRACT_ADDRESS== "undefined") {
      console.log("Missing variable ADSCONTRACT_ADDRESS");
      valid = false;
    }
    if (typeof process.env.MANAGER_SECRET24 == "undefined") {
      console.log("Missing variable MANAGER_SECRET24");
      valid = false;
    }
    if (typeof process.env.MANAGER_ADDRESS == "undefined") {
      console.log("Missing variable MANAGER_ADDRESS");
      valid = false;
    }
    if (typeof process.env.HANDSFORSIERRALEONE_ADDRESS == "undefined") {
      console.log("Missing variable HANDSFORSIERRALEONE_ADDRESS");
      valid = false;
    }
    //if (typeof process.env.MANAGER_PUBLIC_KEY == "undefined") {
    //  console.log("Missing variable MANGER_PUBLIC_KEY");
    //  valid = false;
    //}
    if (typeof process.env.FUND_PERCENTAGE == "undefined") {
      console.log("Missing variable FUND_PERCENTAGE");
      valid = false;
    }
    if (typeof process.env.HOST_BACKEND == "undefined") {
      console.log("Missing variable HOST_BACKEND");
      valid = false;
    }
    if (typeof process.env.PORT_AUTHBACKEND == "undefined") {
      console.log("Missing variable PORT_AUTHBACKEND");
      valid = false;
    }
    if (typeof process.env.PORT_DBBACKEND == "undefined") {
      console.log("Missing variable PORT_DBBACKEND");
      valid = false;
    }


    return valid;

  }

}
