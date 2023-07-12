import { Account, Address, Server, xdr } from "soroban-client";
import { fetchContractValue } from "../soroban";
import { constants, convert } from "@phoenix-protocol/utils";
import { BigNumber } from "bignumber.js";
import { contractTransaction } from "../soroban/build";
import { sendTransaction } from "../soroban/send";
import { freighter } from "../state/wallet/freighter";
import { futurenet } from "../state/wallet/chains";

interface PairClientReadOnlyInterface {
  server: Server;
  networkPassphrase: string;
  contractId: string;
  source: Account | undefined;
  queryPoolInfo: () => Promise<any>;
  provideLiquidity: (
    desiredA: number,
    minA: number,
    desiredB: number,
    minB: number
  ) => Promise<any>;
  withdrawLiquidity: (
    shareAmount: number,
    minA: number,
    minB: number
  ) => Promise<any>;
  swap: (
    sellA: boolean,
    sellAmount: number,
    beliefPrice: number | undefined,
    maxSpread: number
  ) => Promise<any>;
  simulateSwap: (sellA: boolean, sellAmount: number) => Promise<any>;
  simulateReverseSwap: (sellA: boolean, sellAmount: number) => Promise<any>;
  queryShareTokenAddress: () => Promise<any>;
}

export class PairClient implements PairClientReadOnlyInterface {
  server: Server; // Horizon server to connect to
  networkPassphrase: string; // network passphrase
  contractId: string; // contract id for token
  source: Account | undefined; // account to pay for transactions

  constructor(
    server: Server,
    networkPassphrase: string,
    contractId: string,
    source?: Account
  ) {
    this.server = server;
    this.networkPassphrase = networkPassphrase;
    this.contractId = contractId;
    this.source = source;
  }

  async queryPoolInfo(): Promise<any> {
    const scVal = await fetchContractValue({
      server: this.server,
      networkPassphrase: this.networkPassphrase,
      contractId: this.contractId,
      method: "pool_info",
      params: [],
      source: this.source || constants.TESTING_SOURCE,
    });

    const decodedScVal: any = convert.scValToJs(scVal);
    return decodedScVal;
  }

  async queryShareTokenAdress(): Promise<any> {
    const scVal = await fetchContractValue({
      server: this.server,
      networkPassphrase: this.networkPassphrase,
      contractId: this.contractId,
      method: "query_share_token_address",
      params: [],
      source: this.source || constants.TESTING_SOURCE,
    });

    const decodedScVal: any = convert.scValToJs(scVal);
    return decodedScVal;
  }

  async simulateSwap(sellA: boolean, sellAmount: number): Promise<any> {
    const params = [
      xdr.ScVal.scvBool(sellA),
      convert.bigNumberToI128(new BigNumber(sellAmount)),
    ];
    const scVal = await fetchContractValue({
      server: this.server,
      networkPassphrase: this.networkPassphrase,
      contractId: this.contractId,
      method: "simulate_swap",
      params,
      source: this.source || constants.TESTING_SOURCE,
    });

    const decodedScVal: any = convert.scValToJs(scVal);
    return decodedScVal;
  }

  async simulateReverseSwap(sellA: boolean, sellAmount: number): Promise<any> {
    const params = [
      xdr.ScVal.scvBool(sellA),
      convert.bigNumberToI128(new BigNumber(sellAmount)),
    ];
    const scVal = await fetchContractValue({
      server: this.server,
      networkPassphrase: this.networkPassphrase,
      contractId: this.contractId,
      method: "simulate_reverse_swap",
      params,
      source: this.source || constants.TESTING_SOURCE,
    });

    const decodedScVal: any = convert.scValToJs(scVal);
    return decodedScVal;
  }

  async provideLiquidity(
    desiredA: number,
    minA: number,
    desiredB: number,
    minB: number
  ): Promise<any> {
    if (!this.source) throw new Error("No source account");

    const params = [
      new Address(this.source.accountId() || "").toScVal(),
      convert.bigNumberToU128(new BigNumber(desiredA).shiftedBy(7)),
      convert.bigNumberToU128(new BigNumber(minA).shiftedBy(7)),
      convert.bigNumberToU128(new BigNumber(desiredB).shiftedBy(7)),
      convert.bigNumberToU128(new BigNumber(minB).shiftedBy(7)),
    ];

    const tx = contractTransaction({
      networkPassphrase: this.networkPassphrase,
      source: this.source,
      contractId: this.contractId,
      method: "provide_liquidity",
      params: params,
    });

    return await sendTransaction(tx, {}, freighter(), futurenet, this.server);
  }

  async withdrawLiquidity(
    shareAmount: number,
    minA: number,
    minB: number
  ): Promise<any> {
    if (!this.source) throw new Error("No source account");

    const params = [
      new Address(this.source.accountId() || "").toScVal(),
      convert.bigNumberToU128(new BigNumber(shareAmount).shiftedBy(7)),
      convert.bigNumberToU128(new BigNumber(minA).shiftedBy(7)),
      convert.bigNumberToU128(new BigNumber(minB).shiftedBy(7)),
    ];

    const tx = contractTransaction({
      networkPassphrase: this.networkPassphrase,
      source: this.source,
      contractId: this.contractId,
      method: "withdraw_liquidity",
      params: params,
    });

    return await sendTransaction(tx, {}, freighter(), futurenet, this.server);
  }

  async swap(
    sellA: boolean,
    sellAmount: number,
    beliefPrice: number | undefined,
    maxSpread: number
  ): Promise<any> {
    if (!this.source) throw new Error("No source account");

    const params = [
      new Address(this.source.accountId() || "").toScVal(),
      xdr.ScVal.scvBool(sellA),
      convert.bigNumberToU128(new BigNumber(sellAmount).shiftedBy(7)),
      beliefPrice === undefined
        ? xdr.ScVal.scvVoid()
        : xdr.ScVal.scvU64(new xdr.Uint64(1, beliefPrice)),
      xdr.ScVal.scvU64(new xdr.Uint64(1, maxSpread)),
    ];

    const tx = contractTransaction({
      networkPassphrase: this.networkPassphrase,
      source: this.source,
      contractId: this.contractId,
      method: "swap",
      params: params,
    });

    return await sendTransaction(tx, {}, freighter(), futurenet, this.server);
  }
}
