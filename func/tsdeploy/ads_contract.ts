/*
 * Based on https://ton-community.github.io/tutorials/02-contract/
 */

import {
  Address, beginCell, Cell, contractAddress, 
  Contract, ContractProvider, Dictionary, Sender 
} from "ton-core";

import {
  keyPair,
  sign
} from "ton-crypto";

export default class AdsContract implements Contract {

  static createForDeploy(
    code: Cell, manager_address: Address, public_key: Buffer,
    seqno: number, ads: Dictionary<number, Cell>
  ): AdsContract {
    const data = beginCell()
    .storeAddress(manager_address)
    .storeBuffer(public_key, 32) // 32*8 = 256
    .storeUint(seqno, 32)
    .storeDict(ads)
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

  async sendAddAd(provider: ContractProvider, keypair: KeyPair, seqno: integer, via: Sender) {
    const bodyToSign = beginCell()
      .storeUint(seqno, 32)
      .storeUint(1000, 32)
      .endCell

    const hash = bodyToSign.hash();
  
    const signature = sign(hash, keypair.secret_key);

    const messageBody = beginCell()
    .storeUint(signature, 512) 
    .storeSlice(bodyToSign.beginParse())
    .endCell();
    await provider.internal(via, {
      value: "0.002",
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

  /* No soportado aún por ton-core
  async getAds(provider: ContractProvider) {
    const { stack } = await provider.get("get_ads", []);
    return stack.readCellOpt();
  } */

}
