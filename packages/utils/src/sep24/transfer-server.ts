import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Asset, Networks, Horizon } from "stellar-sdk";
import { StellarToml } from "./stellar-toml";
import { joinURL } from "./util";
import * as toml from "toml";

export interface TransferOptions {
  lang?: string;
  walletName?: string;
  walletURL?: string;
}

export type TransferServer = ReturnType<typeof TransferServer>;

function fail(message: string): never {
  throw Error(message);
}

function getTransferServerURL(stellarTomlData: StellarToml): string | null {
  return (
    stellarTomlData.TRANSFER_SERVER_SEP0024 ||
    stellarTomlData.TRANSFER_SERVER ||
    null
  );
}

function getWebAuthServerUrl(stellarTomlData: StellarToml): string | null {
  return stellarTomlData.WEB_AUTH_ENDPOINT || null;
}

export function TransferServer(
  domain: string,
  serverURL: string,
  webauthURL: string,
  assets: Asset[],
  network: Networks,
  signingKey: string,
  options: TransferOptions = {}
) {
  return {
    get assets() {
      return assets;
    },
    get domain() {
      return domain;
    },
    get network() {
      return network;
    },
    get url() {
      return serverURL;
    },
    get auth() {
      return webauthURL;
    },
    get options() {
      return options;
    },
    get signingKey() {
      return signingKey;
    },
    async get<T = any>(
      path: string,
      reqOptions?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      return axios.get(joinURL(serverURL, path), reqOptions);
    },
    async post<T = any>(
      path: string,
      body: any,
      reqOptions?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
      return axios.post(joinURL(serverURL, path), body, reqOptions);
    },
  };
}

export async function openTransferServer(
  domain: string,
  network: Networks,
  options?: TransferOptions
) {
  const response = await fetch(`https://${domain}/.well-known/stellar.toml`);
  const result = await response.text();
  const stellarTomlData = toml.parse(result);
  const serverURL =
    getTransferServerURL(stellarTomlData) ||
    fail(`There seems to be no transfer server on ${domain}.`);
  const webauthURL = getWebAuthServerUrl(stellarTomlData);
  const assets = resolveAssets(stellarTomlData, domain);
  const signingKey = getSigningKey(stellarTomlData);
  const txServer = TransferServer(
    domain,
    serverURL,
    webauthURL!,
    assets,
    network,
    signingKey!,
    options
  );
  return txServer;
}

export async function locateTransferServer(
  domain: string
): Promise<string | null> {
  const response = await fetch(`https://${domain}/.well-known/stellar.toml`);
  const result = await response.text();
  const stellarTomlData = toml.parse(result);
  return getTransferServerURL(stellarTomlData);
}

export function resolveAssets(
  stellarTomlData: StellarToml,
  domain: string = "?"
): Asset[] {
  if (!stellarTomlData.CURRENCIES) {
    throw Error(`No CURRENCIES found in stellar.toml of domain ${domain}.`);
  }

  console.log(stellarTomlData.CURRENCIES);

  return stellarTomlData.CURRENCIES.filter((currency) => currency.code).map(
    (currency) =>
      new Asset(
        currency.code!,
        "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5" // TODO make this dynamic
      )
  );
}

export function getSigningKey(stellarTomlData: StellarToml) {
  return stellarTomlData.SIGNING_KEY;
}

export async function resolveTransferServerURL(
  horizonURL: string,
  asset: Asset
) {
  if (asset.isNative()) {
    throw Error("Native XLM asset does not have an issuer account.");
  }

  const horizon = new Horizon.Server(horizonURL);
  const accountData = await horizon.loadAccount(asset.getIssuer());
  const homeDomain: string | undefined = (accountData as any).home_domain;

  if (!homeDomain) {
    return null;
  }

  return locateTransferServer(homeDomain);
}
