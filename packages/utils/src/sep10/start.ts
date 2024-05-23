import { WebAuth } from "@stellar/stellar-sdk";

export const start = async ({
  authEndpoint,
  serverSigningKey,
  publicKey,
  homeDomain,
  clientDomain,
  memoId,
}: {
  authEndpoint: string;
  serverSigningKey: string;
  publicKey: string;
  homeDomain: string;
  clientDomain: string;
  memoId?: string;
}) => {
  const params = {
    account: publicKey,
    home_domain: homeDomain,
    // Memo ID is in custodial mode
    ...(memoId ? { memo: memoId } : {}),
    // Don't send client domain in custodial mode
    ...(!memoId ? { client_domain: clientDomain } : {}),
  };

  const authURL = new URL(authEndpoint);
  Object.entries(params).forEach(([key, value]) => {
    authURL.searchParams.append(key, value);
  });

  const result = await fetch(authURL.toString());
  const resultJson = await result.json();

  if (!resultJson.transaction) {
    throw new Error("The response didn’t contain a transaction");
  }

  const { tx } = WebAuth.readChallengeTx(
    resultJson.transaction,
    serverSigningKey,
    resultJson.network_passphrase,
    homeDomain,
    authURL.host
  );

  return tx;
};
