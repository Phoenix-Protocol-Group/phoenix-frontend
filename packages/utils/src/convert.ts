import { nativeToScVal, ScInt, scValToBigInt, xdr } from "@stellar/stellar-sdk";
import { Address } from "./Address";
import { AssembledTransaction } from "@stellar/stellar-sdk/lib/contract";

export function strToScVal(base64Xdr: string): xdr.ScVal {
  return xdr.ScVal.fromXDR(base64Xdr, "base64");
}

export function scValStrToJs<T>(base64Xdr: string): T {
  return scValToJs(strToScVal(base64Xdr));
}

export function scValToJs<T>(val: xdr.ScVal): T {
  switch (val?.switch().name) {
    case "scvBool": {
      return val.b() as unknown as T;
    }
    case "scvVoid":
    case undefined: {
      return 0 as unknown as T;
    }
    case "scvU32": {
      return val.u32() as unknown as T;
    }
    case "scvI32": {
      return val.i32() as unknown as T;
    }
    case "scvU64":
    case "scvI64":
    case "scvU128":
    case "scvI128":
    case "scvU256":
    case "scvI256": {
      return scValToBigInt(val) as unknown as T;
    }
    case "scvAddress": {
      return Address.fromScVal(val).toString() as unknown as T;
    }
    case "scvString": {
      return val.str().toString() as unknown as T;
    }
    case "scvSymbol": {
      return val.sym().toString() as unknown as T;
    }
    case "scvBytes": {
      return val.bytes() as unknown as T;
    }
    case "scvVec": {
      type Element = ElementType<T>;
      return val.vec()?.map((v) => scValToJs<Element>(v)) as unknown as T;
    }
    case "scvVec": {
      type Element = ElementType<T>;
      return val.vec()?.map((v) => scValToJs<Element>(v)) as unknown as T;
    }
    case "scvMap": {
      type Key = KeyType<T>;
      type Value = ValueType<T>;
      let res: any = {};
      val.map()?.forEach((e) => {
        let key = scValToJs<Key>(e.key());
        let value;
        let v: xdr.ScVal = e.val();
        // For now we assume second level maps are real maps. Not perfect but better.
        switch (v?.switch().name) {
          case "scvMap": {
            let inner_map = new Map() as Map<any, any>;
            v.map()?.forEach((e) => {
              let key = scValToJs<Key>(e.key());
              let value = scValToJs<Value>(e.val());
              inner_map.set(key, value);
            });
            // Convert inner map to an object
            value = Object.fromEntries(inner_map) as Value;
            break;
          }
          default: {
            value = scValToJs<Value>(e.val());
          }
        }
        //@ts-ignore
        res[key as Key] = value as Value;
      });
      return res as unknown as T;
    }

    case "scvContractInstance":
    case "scvLedgerKeyNonce":
    case "scvTimepoint":
    case "scvDuration":
      return val.value() as unknown as T;
    // TODO: Add this case when merged
    // case scvError:
    default: {
      throw new Error(`type not implemented yet: ${val?.switch().name}`);
    }
  }
}

type ElementType<T> = T extends Array<infer U> ? U : never;
type KeyType<T> = T extends Map<infer K, any> ? K : never;
type ValueType<T> = T extends Map<any, infer V> ? V : never;

export function addressToScVal(addr: string): xdr.ScVal {
  return nativeToScVal(addr, { type: "address" } as any /* bug workaround */);
}

export function i128ToScVal(i: bigint): xdr.ScVal {
  return new ScInt(i).toI128();
}

export function u128ToScVal(i: bigint): xdr.ScVal {
  return new ScInt(i).toU128();
}

export function parseResults<T>(tx: AssembledTransaction<T>): T {
  // @ts-ignore
  return scValToJs(tx.simulation?.result.retval);
}
