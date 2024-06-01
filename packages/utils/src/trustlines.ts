import {
  Asset,
  Horizon,
  Operation,
  SorobanRpc,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { constants } from ".";
import { assetList } from "./assets/assetList";
import { xBull } from "./wallets/xbull";
import { lobstr } from "./wallets/lobstr";

const horizonUrl = "https://horizon.stellar.org";
const server = new Horizon.Server(horizonUrl);

/**
 * Fetches and returns details about an account on the Stellar network.
 * @async
 * @function fetchAccount
 * @param {string} publicKey Public Stellar address to query information about
 * @returns {Promise<AccountRecord>} Object containing whether or not the account is funded, and (if it is) account details
 * @throws {error} Will throw an error if the account is not funded on the Stellar network, or if an invalid public key was provided.
 */
export async function fetchAccount(publicKey: string) {
  if (StrKey.isValidEd25519PublicKey(publicKey)) {
    try {
      let account: Horizon.ServerApi.AccountRecord = await server
        .accounts()
        .accountId(publicKey)
        .call();
      return account;
    } catch (err) {
      return;
    }
  } else {
    throw new Error("invalid public key");
  }
}

function getWalletType(): string {
  const appStorageValue = localStorage.getItem("app-storage");
  if (appStorageValue !== null) {
    try {
      const parsedValue = JSON.parse(appStorageValue);
      const walletType = parsedValue?.state?.wallet?.walletType;
      return walletType;
    } catch (error) {
      console.error("Error parsing app-storage value:", error);
    }
  } else {
    console.error("app-storage key not found in localStorage.");
  }
  return "";
}

export async function checkTrustline(
  publicKey: string,
  assetContractAddress: string
) {
  // Fetch Account
  const account = await fetchAccount(publicKey);

  if (!account) {
    return {
      exists: false,
      asset: null,
    };
  }

  // Check trustlines
  const balances = account.balances;

  const asset = assetList.find(
    (asset) => asset.contract === assetContractAddress
  );

  if (!asset) {
    return {
      exists: true,
      asset: null,
    };
  }

  // Check if trustline exists
  const trustlineExists = balances.some(
    (a) =>
      "asset_issuer" in a &&
      "asset_code" in a &&
      a.asset_issuer === asset.issuer &&
      a.asset_code === asset.code
  );

  return {
    exists: trustlineExists,
    asset,
  };
}

export async function fetchAndIssueTrustline(
  publicKey: string,
  assetContractAddress: string
) {
  // Fetch Account
  const account = await fetchAccount(publicKey);

  if (!account) {
    throw new Error("Account not found");
  }

  // Check trustlines
  const balances = account.balances;

  const asset = assetList.find(
    (asset) => asset.contract === assetContractAddress
  );

  if (!asset) {
    throw new Error("Asset not found");
  }

  // Check if trustline exists
  const trustlineExists = balances.some(
    (a) =>
      "asset_issuer" in a &&
      "asset_code" in a &&
      a.asset_issuer === asset.issuer &&
      a.asset_code === asset.code
  );

  // If trustline does not exist, issue trustline
  if (!trustlineExists) {
    const server = new SorobanRpc.Server(constants.RPC_URL);

    // Find asset name and issuer

    if (!asset) {
      throw new Error("Asset not found");
    }
    // Issue trustline
    const transaction = new TransactionBuilder(
      await server.getAccount(publicKey),
      {
        fee: "100000",
        networkPassphrase: constants.NETWORK_PASSPHRASE,
      }
    )
      .addOperation(
        Operation.changeTrust({
          asset: new Asset(asset.code, asset.issuer),
        })
      )
      .setTimeout(0)
      .build();

    // Get Wallet type
    const walletType = getWalletType();

    // Set wallet to sign
    const wallet =
      walletType === "xbull"
        ? new xBull()
        : walletType === "lobstr"
        ? new lobstr()
        : (await import("@stellar/freighter-api")).default;

    const signature = await wallet.signTransaction(transaction.toXDR());

    const signed = TransactionBuilder.fromXDR(
      signature,
      constants.NETWORK_PASSPHRASE
    );

    await server.sendTransaction(signed);

    return await waitForTrustline(publicKey, assetContractAddress);
  }
}

async function waitForTrustline(
  publicKey: string,
  assetContractAddress: string
): Promise<void> {
  let attempts = 0;
  while (attempts < 5) {
    const result = await checkTrustline(publicKey, assetContractAddress);
    if (result.exists) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    attempts++;
  }
}
