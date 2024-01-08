import { usePersistStore } from "@phoenix-protocol/state";
import { Sep24, Sep10 } from "@phoenix-protocol/utils";

const { openTransferServer, fetchTransferInfos, Deposit } = Sep24;
const { authenticate } = Sep10;

import { useEffect } from "react";
import { Networks } from "stellar-sdk";
const Sep24Test = () => {
  const storePersist = usePersistStore();
  const getData = async () => {
    const transferServer = await openTransferServer(
      "test-kado-anchor-sep.kado.money",
      Networks.TESTNET,
      {
        // Optional
        lang: "en",
        walletName: "Demo wallet",
      }
    );
    const transferInfos = await fetchTransferInfos(transferServer);
    const { depositableAssets, withdrawableAssets } = transferInfos;

    console.log("Test:", depositableAssets, withdrawableAssets);

    const deposit = Deposit(
      transferServer,
      depositableAssets[1],
      "GAFNG7UOA2FDD745PVHFYHSZEIMJ6NYY2BY7ONJ74MRZGHSU2NEHBZ74"
    );

    console.log("After deposit");
    const wallet = (await import("@stellar/freighter-api")).default;
    // Get sep10
    const jwt = await authenticate(
      transferServer.auth,
      transferServer.signingKey,
      storePersist.wallet.address!,
      Networks.TESTNET,
      wallet
    );

    const instructions = await deposit.interactive(jwt);
    console.log(instructions);
  };

  useEffect(() => {
    getData();
  }, []);
  return <></>;
};

export default Sep24Test;
