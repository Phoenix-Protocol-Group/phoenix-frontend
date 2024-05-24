import { AxiosResponse } from "axios";
import FormData from "form-data";
import { Asset } from "@stellar/stellar-sdk";
import { ResponseError } from "./errors";
import { createKYCInstructions, isKYCRequired, KYCInstructions } from "./kyc";
import { TransferResultType } from "./result";
import { TransferServer } from "./transfer-server";

export interface DepositSuccessResponse {
  /**
   * Terse but complete instructions for how to deposit the asset.
   * In the case of most cryptocurrencies it is just an address to which the deposit should be sent.
   */
  how: string;

  /** Estimate of how long the withdrawal will take to credit in seconds. */
  eta?: number;

  /** Minimum amount of an asset that a user can withdraw. */
  min_amount?: number;

  /** Maximum amount of asset that a user can withdraw. */
  max_amount?: number;

  /** If there is a fee for withdraw. In units of the withdrawn asset. */
  fee_fixed?: number;

  /** If there is a percent fee for withdraw. */
  fee_percent?: number;

  /** Any additional data needed as an input for this withdraw, example: Bank Name */
  extra_info?: {
    message?: string;
    [key: string]: any;
  };
}

export interface DepositInstructionsSuccess {
  data: DepositSuccessResponse;
  type: TransferResultType.ok;
}

export type DepositInstructions = DepositInstructionsSuccess | KYCInstructions;

export enum DepositType {
  SEPA = "SEPA",
  SWIFT = "SWIFT",
}

export interface DepositOptions {
  /**
   * The stellar account ID of the user that wants to do the deposit.
   * This is only needed if the anchor requires KYC information for depositing.
   * The anchor can use account to look up the user's KYC information.
   */
  account: string;

  /**
   * The code of the asset the user wants to deposit with the anchor. Ex BTC, ETH, USD,
   * INR, etc. This may be different from the asset code that the anchor issues.
   * Ex if a user deposits BTC and receives MyBTC tokens, asset_code must be BTC.
   */
  asset_code: string;

  /** Email address of depositor. If desired, an anchor can use this to send email updates to the user about the deposit. */
  email_address?: string;

  /** Defaults to `en`. Language code specified using ISO 639-1. `error` fields in the response should be in this language. */
  lang?: string;

  /**
   * A wallet will send this to uniquely identify a user if the wallet has multiple users sharing one Stellar account.
   * The anchor can use this along with account to look up the user's KYC info.
   */
  memo?: string;

  /** Type of memo. One of text, id or hash */
  memo_type?: "hash" | "id" | "text";

  /**
   * Type of deposit. If the anchor supports multiple deposit methods (e.g. SEPA or SWIFT),
   * the wallet should specify type.
   */
  type?: DepositType | string;

  /** In communications / pages about the deposit, anchor should display the wallet name to the user to explain where funds are coming from. */
  wallet_name?: string;

  /** Anchor can show this to the user when referencing the wallet involved in the deposit (ex. in the anchor's transaction history) */
  wallet_url?: string;

  /** The anchor might support custom fields. */
  [customField: string]: string | undefined;
}

export interface Deposit {
  accountID: string;
  asset: Asset;
  fields: DepositOptions;
  transferServer: TransferServer;

  /**
   * Withdraw using the SEP-24 endpoint, redirecting to anchor website for KYC
   */
  interactive(
    authToken?: string | null | undefined
  ): Promise<DepositInstructions>;

  /**
   * Withdraw using the old SEP-6 endpoint
   */
  legacy(authToken?: string | null | undefined): Promise<DepositInstructions>;
}

export function Deposit(
  transferServer: TransferServer,
  asset: Asset,
  destinationAccountID: string,
  fields: Omit<DepositOptions, "account" | "asset_code"> &
    Record<string, string> = {}
): Deposit {
  if (asset.isNative()) {
    throw Error(
      `Cannot deposit lumens, but only assets issued by ${transferServer.domain}.`
    );
  }
  const deposit = {
    accountID: destinationAccountID,
    asset,
    fields: {
      lang: transferServer.options.lang,
      wallet_name: transferServer.options.walletName,
      wallet_url: transferServer.options.walletURL,
      ...fields,
      account: destinationAccountID,
      asset_code: asset.getCode(),
    },
    interactive(
      authToken?: string | null | undefined
    ): Promise<DepositInstructions> {
      return requestInteractiveDeposit(deposit, authToken);
    },
    legacy(
      authToken?: string | null | undefined
    ): Promise<DepositInstructions> {
      return requestLegacyDeposit(deposit, authToken);
    },
    transferServer,
  };
  return deposit;
}

async function requestInteractiveDeposit(
  deposit: Deposit,
  authToken?: string | null | undefined
) {
  const { fields, transferServer } = deposit;
  const body = new FormData();
  (Object.keys(fields) as Array<keyof typeof fields>).forEach((fieldName) => {
    if (typeof fields[fieldName] !== "undefined") {
      body.append(fieldName as string, fields[fieldName]);
    }
  });

  const headers: any = {
    "Content-Type": "multipart/form-data",
  };

  if (authToken) {
    // tslint:disable-next-line no-string-literal
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const validateStatus = (status: number) =>
    status === 200 || status === 201 || status === 400 || status === 403; // 201 is a TEMPO fix

  try {
    return await requestDeposit(deposit, () => {
      return transferServer.post("/transactions/deposit/interactive", body, {
        headers,
        validateStatus,
      });
    });
  } catch (error) {
    //@ts-ignore
    if (error && error.response && error.response.status === 404) {
      return requestLegacyDeposit(deposit, authToken);
      //@ts-ignore
    } else if (error && error.response) {
      //@ts-ignore
      throw ResponseError(error.response, deposit.transferServer);
    } else {
      return requestLegacyDeposit(deposit, authToken);
    }
  }
}

async function requestLegacyDeposit(
  deposit: Deposit,
  authToken?: string | null | undefined
): Promise<DepositInstructions> {
  const { fields, transferServer } = deposit;
  const headers: any = {};

  if (authToken) {
    // tslint:disable-next-line no-string-literal
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const validateStatus = (status: number) =>
    status === 200 || status === 201 || status === 400 || status === 403; // 201 is a TEMPO fix

  return requestDeposit(deposit, () => {
    return transferServer.get("/deposit", {
      headers,
      params: fields,
      validateStatus,
    });
  });
}

async function requestDeposit(
  deposit: Deposit,
  sendRequest: () => Promise<AxiosResponse>
): Promise<DepositInstructions> {
  const { transferServer } = deposit;
  const response = await sendRequest();

  if (isKYCRequired(response)) {
    return createKYCInstructions(response, transferServer.domain);
  } else if (response.status === 200) {
    return {
      data: response.data as DepositSuccessResponse,
      type: TransferResultType.ok,
    };
  } else {
    throw ResponseError(response, deposit.transferServer);
  }
}
