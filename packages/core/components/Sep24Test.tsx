import { usePersistStore } from "@phoenix-protocol/state";
import {
  Sep24,
  sep10AuthStart,
  sep10AuthSign,
  sep10AuthSend,
} from "@phoenix-protocol/utils";
import { NETWORK_PASSPHRASE } from "@phoenix-protocol/utils/build/constants";

const { openTransferServer, fetchTransferInfos, Deposit } = Sep24;

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

    // Get sep10
    // SEP-10 start
    const challengeTransaction = await sep10AuthStart({
      authEndpoint: transferServer.auth,
      serverSigningKey: transferServer.signingKey,
      publicKey: storePersist.wallet.address!,
      homeDomain: transferServer.domain,
      clientDomain: "https://app.phoenix-hub.io",
      memoId: undefined,
    });

    const signedChallengeTransaction = await sep10AuthSign({
      networkPassphrase: NETWORK_PASSPHRASE,
      challengeTransaction,
      wallet: (await import("@stellar/freighter-api")).default,
    });

    const token = await sep10AuthSend({
      authEndpoint: transferServer.auth,
      signedChallengeTransaction,
    });
  };

  useEffect(() => {
    getData();
  }, []);
  return <></>;
};

export default Sep24Test;
