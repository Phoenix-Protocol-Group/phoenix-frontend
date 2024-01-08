import { Horizon } from "stellar-sdk";
import * as toml from "toml";

export interface WebauthData {
  domain: string;
  endpointURL: string;
  signingKey: string | null;
}

interface StellarTomlData {
  [key: string]: any;
}

export function getServiceSigningKey(
  stellarTomlData: StellarTomlData
): string | null {
  return stellarTomlData.SIGNING_KEY || null;
}

export function getWebAuthEndpointURL(
  stellarTomlData: StellarTomlData
): string | null {
  return stellarTomlData.WEB_AUTH_ENDPOINT || null;
}

export async function fetchWebAuthData(
  horizon: Horizon.Server,
  issuerAccountID: string
): Promise<WebauthData | null> {
  const account = await horizon.loadAccount(issuerAccountID);
  const domain = (account as any).home_domain;

  if (!domain) {
    return null;
  }
  const response = await fetch(`https://${domain}/.well-known/stellar.toml`);
  const result = await response.text();
  const stellarTomlData = await toml.parse(result);
  const endpointURL = getWebAuthEndpointURL(stellarTomlData);
  const signingKey = getServiceSigningKey(stellarTomlData);

  if (!endpointURL || !signingKey) {
    return null;
  }

  return {
    domain,
    endpointURL,
    signingKey,
  };
}
