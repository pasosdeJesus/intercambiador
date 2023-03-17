/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import {
  Address, beginCell, Cell, contractAddress,
  Contract, ContractProvider, Dictionary, Sender
} from "ton-core";

import {
  KeyPair,
  keyPairFromSeed,
  mnemonicToPrivateKey,
  sign
} from "ton-crypto";

export default class AdsContract implements Contract {

  static createForDeploy(
    code: Cell,
    manager_address: Address,
    public_key: Buffer,
    seqno: number,
    fund_address: Address,
    fund_percentage: number,
    selling_ads: Dictionary<Address, Cell>,
    buying_ads: Dictionary<Address, Cell>,
    payments_buying_ads: Dictionary<Address, Cell>,
  ): AdsContract {
    const data = beginCell()
    .storeAddress(manager_address)
    .storeBuffer(public_key, 32) // 32*8 = 256
    .storeUint(seqno, 32)
    .storeAddress(fund_address)
    .storeUint(fund_percentage, 8)
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

  async sendAdd(
    provider: ContractProvider, keypair: KeyPair, seqno: bigint, coins: number, via: Sender
  ) {
    const bodyToSign = beginCell()
      .storeUint(seqno, 32)
      .storeUint(1000, 32)
      .endCell();

    const hash = bodyToSign.hash();

    const signature = sign(hash, keypair.secretKey);

    const messageBody = beginCell()
    .storeBuffer(signature)
    .storeSlice(bodyToSign.beginParse())
    .endCell();
    await provider.internal(via, {
      value: coins.toString(),  // Needs at least 0.005 because checks signature, with 0.002 produced error -14, out of gas
      body: messageBody
    });
  }

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

/* address must be converted to TupleItem 
   async getSellingAd(provider: ContractProvider, address: Address) {
    const { stack } = await provider.get("get_selling_ad_addresses", [address]);
    return stack.readTuple();
  } */



  /* No soportado aún por ton-core
  async getAds(provider: ContractProvider) {
    const { stack } = await provider.get("get_ads", []);
    return stack.readCellOpt();
  } */

}
