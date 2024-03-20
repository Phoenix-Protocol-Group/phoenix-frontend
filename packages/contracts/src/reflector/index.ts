import { ContractSpec, Address, xdr } from "stellar-sdk";
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from "@phoenix-protocol/utils";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
  Error_,
  Result,
} from "@phoenix-protocol/utils";
import type { ClassOptions, XDR_BASE64 } from "@phoenix-protocol/utils";
export * from "@phoenix-protocol/utils";

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}


export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "0",
    }
} as const

/**
    
    */
export type Asset = {tag: "Stellar", values: readonly [string]} | {tag: "Other", values: readonly [string]};

/**
    
    */
export interface ConfigData {
  /**
    
    */
admin: string;
  /**
    
    */
assets: Array<Asset>;
  /**
    
    */
base_asset: Asset;
  /**
    
    */
decimals: u32;
  /**
    
    */
period: u64;
  /**
    
    */
resolution: u32;
}

/**
    
    */
export const Errors = {
0: {message:""},
  1: {message:""},
  2: {message:""},
  3: {message:""},
  4: {message:""},
  5: {message:""},
  6: {message:""},
  7: {message:""}
}
/**
    
    */
export interface PriceData {
  /**
    
    */
price: i128;
  /**
    
    */
timestamp: u64;
}


export class Contract {
    spec: ContractSpec;
    constructor(public readonly options: ClassOptions) {
        this.spec = new ContractSpec([
            "AAAAAgAAAAAAAAAAAAAABUFzc2V0AAAAAAAAAgAAAAEAAAAAAAAAB1N0ZWxsYXIAAAAAAQAAABMAAAABAAAAAAAAAAVPdGhlcgAAAAAAAAEAAAAR",
        "AAAAAQAAAAAAAAAAAAAACkNvbmZpZ0RhdGEAAAAAAAYAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAGYXNzZXRzAAAAAAPqAAAH0AAAAAVBc3NldAAAAAAAAAAAAAAKYmFzZV9hc3NldAAAAAAH0AAAAAVBc3NldAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAAZwZXJpb2QAAAAAAAYAAAAAAAAACnJlc29sdXRpb24AAAAAAAQ=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAAAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAABAAAAAAAAAAxBc3NldE1pc3NpbmcAAAACAAAAAAAAABJBc3NldEFscmVhZHlFeGlzdHMAAAAAAAMAAAAAAAAAFEludmFsaWRDb25maWdWZXJzaW9uAAAABAAAAAAAAAAQSW52YWxpZFRpbWVzdGFtcAAAAAUAAAAAAAAAE0ludmFsaWRVcGRhdGVMZW5ndGgAAAAABgAAAAAAAAASQXNzZXRMaW1pdEV4Y2VlZGVkAAAAAAAH",
        "AAAAAQAAAAAAAAAAAAAACVByaWNlRGF0YQAAAAAAAAIAAAAAAAAABXByaWNlAAAAAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAAAAAAAAAAAEYmFzZQAAAAAAAAABAAAH0AAAAAVBc3NldAAAAA==",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAKcmVzb2x1dGlvbgAAAAAAAAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAGcGVyaW9kAAAAAAAAAAAAAQAAA+gAAAAG",
        "AAAAAAAAAAAAAAAGYXNzZXRzAAAAAAAAAAAAAQAAA+oAAAfQAAAABUFzc2V0AAAA",
        "AAAAAAAAAAAAAAAObGFzdF90aW1lc3RhbXAAAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAFcHJpY2UAAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAB9AAAAAFQXNzZXQAAAAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAABAAAD6AAAB9AAAAAJUHJpY2VEYXRhAAAA",
        "AAAAAAAAAAAAAAAJbGFzdHByaWNlAAAAAAAAAQAAAAAAAAAFYXNzZXQAAAAAAAfQAAAABUFzc2V0AAAAAAAAAQAAA+gAAAfQAAAACVByaWNlRGF0YQAAAA==",
        "AAAAAAAAAAAAAAAGcHJpY2VzAAAAAAACAAAAAAAAAAVhc3NldAAAAAAAB9AAAAAFQXNzZXQAAAAAAAAAAAAAB3JlY29yZHMAAAAABAAAAAEAAAPoAAAD6gAAB9AAAAAJUHJpY2VEYXRhAAAA",
        "AAAAAAAAAAAAAAAMeF9sYXN0X3ByaWNlAAAAAgAAAAAAAAAKYmFzZV9hc3NldAAAAAAH0AAAAAVBc3NldAAAAAAAAAAAAAALcXVvdGVfYXNzZXQAAAAH0AAAAAVBc3NldAAAAAAAAAEAAAPoAAAH0AAAAAlQcmljZURhdGEAAAA=",
        "AAAAAAAAAAAAAAAHeF9wcmljZQAAAAADAAAAAAAAAApiYXNlX2Fzc2V0AAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAtxdW90ZV9hc3NldAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAQAAA+gAAAfQAAAACVByaWNlRGF0YQAAAA==",
        "AAAAAAAAAAAAAAAIeF9wcmljZXMAAAADAAAAAAAAAApiYXNlX2Fzc2V0AAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAtxdW90ZV9hc3NldAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAdyZWNvcmRzAAAAAAQAAAABAAAD6AAAA+oAAAfQAAAACVByaWNlRGF0YQAAAA==",
        "AAAAAAAAAAAAAAAEdHdhcAAAAAIAAAAAAAAABWFzc2V0AAAAAAAH0AAAAAVBc3NldAAAAAAAAAAAAAAHcmVjb3JkcwAAAAAEAAAAAQAAA+gAAAAL",
        "AAAAAAAAAAAAAAAGeF90d2FwAAAAAAADAAAAAAAAAApiYXNlX2Fzc2V0AAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAtxdW90ZV9hc3NldAAAAAfQAAAABUFzc2V0AAAAAAAAAAAAAAdyZWNvcmRzAAAAAAQAAAABAAAD6AAAAAs=",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAA+gAAAAT",
        "AAAAAAAAAAAAAAAGY29uZmlnAAAAAAABAAAAAAAAAAZjb25maWcAAAAAB9AAAAAKQ29uZmlnRGF0YQAAAAAAAA==",
        "AAAAAAAAAAAAAAAEYnVtcAAAAAEAAAAAAAAAD2xlZGdlcnNfdG9fbGl2ZQAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAKYWRkX2Fzc2V0cwAAAAAAAQAAAAAAAAAGYXNzZXRzAAAAAAPqAAAH0AAAAAVBc3NldAAAAAAAAAA=",
        "AAAAAAAAAAAAAAAKc2V0X3BlcmlvZAAAAAAAAQAAAAAAAAAGcGVyaW9kAAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAJc2V0X3ByaWNlAAAAAAAAAgAAAAAAAAAHdXBkYXRlcwAAAAPqAAAACwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAAAA=",
        "AAAAAAAAAAAAAAAPdXBkYXRlX2NvbnRyYWN0AAAAAAEAAAAAAAAACXdhc21faGFzaAAAAAAAA+4AAAAgAAAAAA=="
        ]);
    }
    private readonly parsers = {
        base: (result: string | xdr.ScVal | Err): void | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("base", result);
        },
        decimals: (result: string | xdr.ScVal | Err): u32 | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("decimals", result);
        },
        resolution: (result: string | xdr.ScVal | Err): u32 | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("resolution", result); 
        },
        period: (result: string | xdr.ScVal | Err): Option<u64> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("period", result);
        },
        assets: (result: string | xdr.ScVal | Err): Array<Asset> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("assets", result);
        },
        lastTimestamp: (result: string | xdr.ScVal | Err): u64 | Err<Error_> =>{
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("last_timestamp", result); 
        },
        price: (result: string | xdr.ScVal | Err): Option<PriceData> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("price", result);
        },
        lastprice: (result: string | xdr.ScVal | Err): Option<PriceData> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("lastprice", result);
        },
        prices: (result: string | xdr.ScVal | Err): Option<Array<PriceData>> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("prices", result);
        },
        xLastPrice: (result: string | xdr.ScVal | Err): Option<PriceData> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("x_last_price", result);
        },
        xPrice: (result: string | xdr.ScVal | Err): Option<PriceData> | Err<Error_> => {
          if (result instanceof Err) return result; 
          return this.spec.funcResToNative("x_price", result);
        },
        xPrices: (result: string | xdr.ScVal | Err): Option<Array<PriceData>> | Err<Error_> => {
          if (result instanceof Err) return result; 
          return this.spec.funcResToNative("x_prices", result);
        },
        twap: (result: string | xdr.ScVal | Err): Option<i128> | Err<Error_> => {
          if (result instanceof Err) return result;
          return this.spec.funcResToNative("twap", result);
        },
        xTwap: (result: string | xdr.ScVal | Err): Option<i128> | Err<Error_> => {
          if (result instanceof Err) return result; 
          return this.spec.funcResToNative("x_twap", result);
        },
        version: (result: string | xdr.ScVal | Err): u32 | Err<Error_> => {
          if (result instanceof Err) return result; 
          return this.spec.funcResToNative("version", result);
        },
        admin: (result: string | xdr.ScVal | Err): Option<string> | Err<Error_> => {
          if (result instanceof Err) return result; 
          return this.spec.funcResToNative("admin", result);
        },
        config: () => {},
        bump: () => {},
        addAssets: () => {},
        setPeriod: () => {},
        setPrice: () => {},
        updateContract: () => {}
    };
    private txFromJSON = <T>(json: string): AssembledTransaction<T> => {
        const { method, ...tx } = JSON.parse(json)
        return AssembledTransaction.fromJSON(
            {
                ...this.options,
                method,
                //@ts-ignore
                parseResultXdr: this.parsers[method],
            },
            tx,
        );
    }
    public readonly fromJSON = {
        base: this.txFromJSON<ReturnType<typeof this.parsers['base']>>,
        decimals: this.txFromJSON<ReturnType<typeof this.parsers['decimals']>>,
        resolution: this.txFromJSON<ReturnType<typeof this.parsers['resolution']>>,
        period: this.txFromJSON<ReturnType<typeof this.parsers['period']>>,
        assets: this.txFromJSON<ReturnType<typeof this.parsers['assets']>>,
        lastTimestamp: this.txFromJSON<ReturnType<typeof this.parsers['lastTimestamp']>>,
        price: this.txFromJSON<ReturnType<typeof this.parsers['price']>>,
        lastprice: this.txFromJSON<ReturnType<typeof this.parsers['lastprice']>>,
        prices: this.txFromJSON<ReturnType<typeof this.parsers['prices']>>,
        xLastPrice: this.txFromJSON<ReturnType<typeof this.parsers['xLastPrice']>>,
        xPrice: this.txFromJSON<ReturnType<typeof this.parsers['xPrice']>>,
        xPrices: this.txFromJSON<ReturnType<typeof this.parsers['xPrices']>>,
        twap: this.txFromJSON<ReturnType<typeof this.parsers['twap']>>,
        xTwap: this.txFromJSON<ReturnType<typeof this.parsers['xTwap']>>,
        version: this.txFromJSON<ReturnType<typeof this.parsers['version']>>,
        admin: this.txFromJSON<ReturnType<typeof this.parsers['admin']>>,
        config: this.txFromJSON<ReturnType<typeof this.parsers['config']>>,
        bump: this.txFromJSON<ReturnType<typeof this.parsers['bump']>>,
        addAssets: this.txFromJSON<ReturnType<typeof this.parsers['addAssets']>>,
        setPeriod: this.txFromJSON<ReturnType<typeof this.parsers['setPeriod']>>,
        setPrice: this.txFromJSON<ReturnType<typeof this.parsers['setPrice']>>,
        updateContract: this.txFromJSON<ReturnType<typeof this.parsers['updateContract']>>
    }
        /**
    * Construct and simulate a base transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    base = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'base',
            args: this.spec.funcArgsToScVals("base", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['base'],
        });
    }


        /**
    * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    decimals = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'decimals',
            args: this.spec.funcArgsToScVals("decimals", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['decimals'],
        });
    }


        /**
    * Construct and simulate a resolution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    resolution = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'resolution',
            args: this.spec.funcArgsToScVals("resolution", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['resolution'],
        });
    }


        /**
    * Construct and simulate a period transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    period = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'period',
            args: this.spec.funcArgsToScVals("period", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['period'],
        });
    }


        /**
    * Construct and simulate a assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    assets = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'assets',
            args: this.spec.funcArgsToScVals("assets", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['assets'],
        });
    }


        /**
    * Construct and simulate a last_timestamp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    lastTimestamp = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'last_timestamp',
            args: this.spec.funcArgsToScVals("last_timestamp", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['lastTimestamp'],
        });
    }


        /**
    * Construct and simulate a price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    price = async ({asset, timestamp}: {asset: Asset, timestamp: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'price',
            args: this.spec.funcArgsToScVals("price", {asset, timestamp}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['price'],
        });
    }


        /**
    * Construct and simulate a lastprice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    lastprice = async ({asset}: {asset: Asset}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'lastprice',
            args: this.spec.funcArgsToScVals("lastprice", {asset}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['lastprice'],
        });
    }


        /**
    * Construct and simulate a prices transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    prices = async ({asset, records}: {asset: Asset, records: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'prices',
            args: this.spec.funcArgsToScVals("prices", {asset, records}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['prices'],
        });
    }


        /**
    * Construct and simulate a x_last_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    xLastPrice = async ({base_asset, quote_asset}: {base_asset: Asset, quote_asset: Asset}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'x_last_price',
            args: this.spec.funcArgsToScVals("x_last_price", {base_asset, quote_asset}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['xLastPrice'],
        });
    }


        /**
    * Construct and simulate a x_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    xPrice = async ({base_asset, quote_asset, timestamp}: {base_asset: Asset, quote_asset: Asset, timestamp: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'x_price',
            args: this.spec.funcArgsToScVals("x_price", {base_asset, quote_asset, timestamp}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['xPrice'],
        });
    }


        /**
    * Construct and simulate a x_prices transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    xPrices = async ({base_asset, quote_asset, records}: {base_asset: Asset, quote_asset: Asset, records: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'x_prices',
            args: this.spec.funcArgsToScVals("x_prices", {base_asset, quote_asset, records}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['xPrices'],
        });
    }


        /**
    * Construct and simulate a twap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    twap = async ({asset, records}: {asset: Asset, records: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'twap',
            args: this.spec.funcArgsToScVals("twap", {asset, records}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['twap'],
        });
    }


        /**
    * Construct and simulate a x_twap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    xTwap = async ({base_asset, quote_asset, records}: {base_asset: Asset, quote_asset: Asset, records: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'x_twap',
            args: this.spec.funcArgsToScVals("x_twap", {base_asset, quote_asset, records}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['xTwap'],
        });
    }


        /**
    * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    version = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['version'],
        });
    }


        /**
    * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    admin = async (options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'admin',
            args: this.spec.funcArgsToScVals("admin", {}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['admin'],
        });
    }


        /**
    * Construct and simulate a config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    config = async ({config}: {config: ConfigData}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'config',
            args: this.spec.funcArgsToScVals("config", {config}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['config'],
        });
    }


        /**
    * Construct and simulate a bump transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    bump = async ({ledgers_to_live}: {ledgers_to_live: u32}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'bump',
            args: this.spec.funcArgsToScVals("bump", {ledgers_to_live}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['bump'],
        });
    }


        /**
    * Construct and simulate a add_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    addAssets = async ({assets}: {assets: Array<Asset>}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'add_assets',
            args: this.spec.funcArgsToScVals("add_assets", {assets}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['addAssets'],
        });
    }


        /**
    * Construct and simulate a set_period transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setPeriod = async ({period}: {period: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_period',
            args: this.spec.funcArgsToScVals("set_period", {period}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPeriod'],
        });
    }


        /**
    * Construct and simulate a set_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    setPrice = async ({updates, timestamp}: {updates: Array<i128>, timestamp: u64}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'set_price',
            args: this.spec.funcArgsToScVals("set_price", {updates, timestamp}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['setPrice'],
        });
    }


        /**
    * Construct and simulate a update_contract transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
    */
    updateContract = async ({wasm_hash}: {wasm_hash: Buffer}, options: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number,
    } = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'update_contract',
            args: this.spec.funcArgsToScVals("update_contract", {wasm_hash}),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['updateContract'],
        });
    }

}
