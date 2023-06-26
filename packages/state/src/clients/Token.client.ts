import { Account, Address, Server } from "soroban-client";
import { fetchContractValue } from "../soroban";
import { convert } from "@phoenix-protocol/utils";
import BigNumber from "bignumber.js";

interface SorobanTokenClientReadOnlyInterface {
  server: Server;
  networkPassphrase: string;
  contractId: string;
  source: Account;
  balance: () => Promise<BigNumber>;
}

export class SorobanTokenQueryClient
  implements SorobanTokenClientReadOnlyInterface
{
  server: Server; // Horizon server to connect to
  networkPassphrase: string; // network passphrase
  contractId: string; // contract id for token
  source: Account; // account to pay for transactions

  constructor(
    server: Server,
    networkPassphrase: string,
    contractId: string,
    source: Account
  ) {
    this.server = server;
    this.networkPassphrase = networkPassphrase;
    this.contractId = contractId;
    this.source = source;
  }

  async balance(): Promise<BigNumber> {
    try {
      // Fetch token balance
      const scVal = await fetchContractValue({
        server: this.server,
        networkPassphrase: this.networkPassphrase,
        contractId: this.contractId,
        method: "balance",
        params: [new Address(this.source.accountId()).toScVal()],
        source: this.source,
      });
      // decode the balance
      const decodedScVal: BigNumber = convert.scValToJs(scVal);
      return decodedScVal;
    } catch (error) {
      // Handle error
    }
    return new BigNumber(0);
  }
}
