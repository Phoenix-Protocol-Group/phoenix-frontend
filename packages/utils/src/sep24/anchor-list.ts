import { openTransferServer } from "./transfer-server";
import { Networks } from "stellar-sdk";
import { fetchTransferInfos } from "./info";
import { Token } from "@phoenix-protocol/types";

export const anchorStatics = [
  {
    name: "kado",
    logo: "anchors/kado.svg",
    sep: ["sep24"],
    url: "test-kado-anchor-sep.kado.money/sep24",
  },
];

export const getAllAnchors = async (): Promise<any> => {
  const all = anchorStatics.map(async (anchor) => {
    const transferServer = await openTransferServer(
      anchor.url,
      Networks.TESTNET,
      {
        // Optional
        lang: "en",
        walletName: "Phoenix Wallet",
      }
    );
    const transferInfos = await fetchTransferInfos(transferServer);
    const { depositableAssets } = transferInfos;

    const tokens = depositableAssets;
    return {
      name: anchor.name,
      logo: anchor.logo,
      sep: anchor.sep as ("sep24" | "sep6")[],
      domain: anchor.url,
      tokens: tokens.map((token): Token => {
        return {
          name: token.code === "native" ? "xlm" : token.code,
          icon: `cryptoIcons/${
            token.code === "native" ? "xlm" : token.code
          }.svg`,
          amount: 0,
          category: "Stable",
          usdValue: 0,
        };
      }),
    };
  });

  return Promise.all(all);
};
