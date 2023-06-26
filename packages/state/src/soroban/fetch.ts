import * as SorobanClient from "soroban-client";

export interface fetchContractValueProps {
  server: SorobanClient.Server;
  networkPassphrase: string;
  contractId: string;
  method: string;
  params?: SorobanClient.xdr.ScVal[] | undefined;
  source: SorobanClient.Account;
}

export async function fetchContractValue({
  server,
  networkPassphrase,
  contractId,
  method,
  params,
  source,
}: fetchContractValueProps): Promise<SorobanClient.xdr.ScVal> {
  const contract = new SorobanClient.Contract(contractId);

  let myParams: SorobanClient.xdr.ScVal[] = params || [];

  // TODO: Optionally include the wallet of the submitter here, so the
  // simulation is more accurate
  const transaction = new SorobanClient.TransactionBuilder(source, {
    // fee doesn't matter, we're not submitting
    fee: "100",
    networkPassphrase,
  })
    .addOperation(contract.call(method, ...myParams))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const { results } = await server.simulateTransaction(transaction);
  if (!results || results.length !== 1) {
    throw new Error("Invalid response from simulateTransaction");
  }
  const result = results[0];
  return SorobanClient.xdr.ScVal.fromXDR(result.xdr, "base64");
}
