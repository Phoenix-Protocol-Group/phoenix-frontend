import { Asset } from "stellar-sdk";
import { TransferServer } from "./transfer-server";

const dedupe = <T>(array: T[]): T[] => Array.from(new Set(array));

function fail(message: string): never {
  throw Error(message);
}

export interface TransferInfoFields {
  /** Can be a deposit / withdrawal property or some custom field. */
  [fieldName: string]: {
    /** Description of field to show to user. */
    description: string;
    /** If field is optional. Defaults to false. */
    optional?: boolean;
    /** List of possible values for the field. */
    choices?: string[];
  };
}

export interface TransferInfoResponse {
  deposit: {
    [assetCode: string]: {
      /** Optional. `true` if client must be authenticated before accessing the deposit endpoint for this asset. `false` if not specified. */
      authentication_required?: boolean;
      /** Set if SEP-6 deposit for this asset is supported. */
      enabled: boolean;
      /**
       * Optional fixed (flat) fee for deposit. In units of the deposited asset.
       * Blank if there is no fee or the fee schedule is complex.
       */
      fee_fixed?: number;
      /**
       * Optional percentage fee for deposit. In percentage points.
       * Blank if there is no fee or the fee schedule is complex.
       */
      fee_percent?: number;
      /**
       * The fields object allows an anchor to describe fields that are passed into /deposit.
       * It can explain standard fields like dest and dest_extra for withdrawal, and it can also
       * specify extra fields that should be passed into /deposit such as an email address or bank name.
       * Only fields that are passed to /deposit need appear here.
       */
      fields?: TransferInfoFields;
      /** Optional minimum amount. No limit if not specified. */
      min_amount?: number;
      /** Optional maximum amount. No limit if not specified. */
      max_amount?: number;
    };
  };
  withdraw: {
    [assetCode: string]: {
      /** Optional. `true` if client must be authenticated before accessing the deposit endpoint for this asset. `false` if not specified. */
      authentication_required?: boolean;
      /** Set if SEP-6 deposit for this asset is supported. */
      enabled: boolean;
      /**
       * Optional fixed (flat) fee for withdraw. In units of the deposited asset.
       * Blank if there is no fee or the fee schedule is complex.
       */
      fee_fixed?: number;
      /**
       * Optional percentage fee for withdraw. In percentage points.
       * Blank if there is no fee or the fee schedule is complex.
       */
      fee_percent?: number;
      /** Optional minimum amount. No limit if not specified. */
      min_amount?: number;
      /** Optional maximum amount. No limit if not specified. */
      max_amount?: number;
      /**
       * Each type of withdrawal supported for that asset as a key.
       * Each type can specify a fields object explaining what fields are needed and what they do.
       */
      types?: {
        [withdrawalMethod: string]: {
          /**
           * The fields object allows an anchor to describe fields that are passed into /withdraw.
           * It can explain standard fields like dest and dest_extra for withdrawal, and it can also
           * specify extra fields that should be passed into /withdraw such as an email address or bank name.
           * Only fields that are passed to /withdraw need appear here.
           */
          fields?: TransferInfoFields;
        };
      };
    };
  };
  fee?: {
    /** Indicates that the optional /fee endpoint is supported. */
    enabled: boolean;

    /** Optional. `true` if client must be authenticated before accessing the deposit endpoint for this asset. `false` if not specified. */
    authentication_required?: boolean;
  };
  transaction?: {
    /** Indicates that the optional /transaction endpoint is supported. */
    enabled: boolean;

    /** Optional. `true` if client must be authenticated before accessing the deposit endpoint for this asset. `false` if not specified. */
    authentication_required?: boolean;
  };
  transactions?: {
    /** Indicates that the optional /transactions endpoint is supported. */
    enabled: boolean;

    /** Optional. `true` if client must be authenticated before accessing the deposit endpoint for this asset. `false` if not specified. */
    authentication_required?: boolean;
  };
}

export interface AssetTransferInfo {
  asset: Asset;
  deposit: TransferInfoResponse["deposit"][""] | undefined;
  transferServer: TransferServer;
  withdraw: TransferInfoResponse["withdraw"][""] | undefined;
}

export interface TransferServerInfo {
  assets: AssetTransferInfo[];
  depositableAssets: Asset[];
  endpoints: TransferInfoResponse;
  transferServer: TransferServer;
  withdrawableAssets: Asset[];
}

export async function fetchTransferInfos(
  transferServer: TransferServer
): Promise<TransferServerInfo> {
  const response = await transferServer.get<TransferInfoResponse>("/info");
  const assetCodes = dedupe([
    ...Object.keys(response.data.deposit),
    ...Object.keys(response.data.withdraw),
  ]).filter(
    // TEMPO work-around…
    (assetCode) => assetCode !== "transactions"
  );
  const assetInfos = assetCodes
    // Filter out assets that the transfer server lists, but are not in
    // the stellar.toml. Prevent crashes on partially inconsistent data.
    .filter((assetCode) =>
      transferServer.assets.some((asset) => asset.code === assetCode)
    )
    .map<AssetTransferInfo>((assetCode) => ({
      asset:
        transferServer.assets.find((asset) => asset.code === assetCode) ||
        fail(`${transferServer.domain} does not issue asset ${assetCode}.`),
      deposit: response.data.deposit[assetCode],
      endpoints: response.data,
      transferServer,
      withdraw: response.data.withdraw[assetCode],
    }));
  return {
    assets: assetInfos,
    depositableAssets: assetInfos
      .filter((info) => info.deposit)
      .map((info) => info.asset),
    endpoints: response.data,
    transferServer,
    withdrawableAssets: assetInfos
      .filter((info) => info.withdraw)
      .map((info) => info.asset),
  };
}
