import * as SorobanClient from "soroban-client";

let keypair = SorobanClient.Keypair.fromSecret(process.env.SECRET_KEY);

function i128ToScVal(i: bigint): SorobanClient.xdr.ScVal {
  return new SorobanClient.ScInt(i).toI128();
}

function addressToScVal(addr: string): SorobanClient.xdr.ScVal {
  return SorobanClient.nativeToScVal(
    addr,
    { type: "address" } as any /* bug workaround */
  );
}

export async function nativeTransaction(
  account: SorobanClient.Account,
  server: SorobanClient.Server,
  to: string,
  amount: string
) {
  let transaction = new SorobanClient.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: SorobanClient.Networks.FUTURENET,
  })
    .addOperation(
      SorobanClient.Operation.payment({
        destination: to,
        asset: SorobanClient.Asset.native(),
        amount: (Number(amount) / 10 ** 7).toString(),
      })
    )
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();
  transaction.sign(keypair);

  const txResult = await server.sendTransaction(transaction);
  console.log(JSON.stringify(txResult));
  return waitForResult(server, txResult.hash);
}

export async function tokenTransaction(
  account: SorobanClient.Account,
  server: SorobanClient.Server,
  from: string,
  to: string,
  amount: string,
  token: string
) {
  const contract = new SorobanClient.Contract(token);

  const transaction = new SorobanClient.TransactionBuilder(account, {
    fee: "200",
    networkPassphrase: SorobanClient.Networks.FUTURENET,
  })
    .addOperation(
      contract.call(
        "transfer",
        new SorobanClient.Address(from).toScVal(),
        new SorobanClient.Address(to).toScVal(),
        i128ToScVal(BigInt(amount))
      )
    )
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const preparedTX = await server.prepareTransaction(
    transaction,
    SorobanClient.Networks.FUTURENET
  );
  const xdr = preparedTX.toXDR();

  const tx = SorobanClient.TransactionBuilder.fromXDR(
    xdr,
    SorobanClient.Networks.FUTURENET
  );
  tx.sign(keypair);

  const txResult = await server.sendTransaction(tx);
  return waitForResult(server, txResult.hash);
}

async function waitForResult(server: SorobanClient.Server, hash: string) {
  let queryResult: any = null;

  do {
    await new Promise((resolve) => setTimeout(resolve, 500));
    queryResult = await server.getTransaction(hash);

    console.log(`Transaction Status: ${queryResult.status}`);
    if (queryResult.status === "FAILED") {
      throw new Error(JSON.stringify(queryResult));
    }
  } while (queryResult.status !== "SUCCESS");

  return queryResult;
}
