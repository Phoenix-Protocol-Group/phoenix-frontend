import BigNumber from "bignumber.js";
import * as SorobanClient from "soroban-client";
let xdr = SorobanClient.xdr;

export function scvalToBigNumber(
  scval: SorobanClient.xdr.ScVal | undefined
): BigNumber {
  switch (scval?.switch()) {
    case undefined: {
      return BigNumber(0);
    }
    case xdr.ScValType.scvU32(): {
      return BigNumber(scval.u32());
    }
    case xdr.ScValType.scvI32(): {
      return BigNumber(scval.i32());
    }
    case xdr.ScValType.scvU64(): {
      const { high, low } = scval.u64();
      return bigNumberFromBytes(false, high, low);
    }
    case xdr.ScValType.scvI64(): {
      const { high, low } = scval.i64();
      return bigNumberFromBytes(true, high, low);
    }
    case xdr.ScValType.scvU128(): {
      const parts = scval.u128();
      const a = parts.hi();
      const b = parts.lo();
      return bigNumberFromBytes(false, a.high, a.low, b.high, b.low);
    }
    case xdr.ScValType.scvI128(): {
      let low = scval.i128().lo();
      let high = scval.i128().hi();
      const res = BigInt(low.low) | (BigInt(high.high) << BigInt(32));
      return BigNumber(res.toString());
    }
    case xdr.ScValType.scvU256(): {
      const parts = scval.u256();
      const a = parts.hiHi();
      const b = parts.hiLo();
      const c = parts.loHi();
      const d = parts.loLo();
      return bigNumberFromBytes(
        false,
        a.high,
        a.low,
        b.high,
        b.low,
        c.high,
        c.low,
        d.high,
        d.low
      );
    }
    case xdr.ScValType.scvI256(): {
      const parts = scval.i256();
      const a = parts.hiHi();
      const b = parts.hiLo();
      const c = parts.loHi();
      const d = parts.loLo();
      return bigNumberFromBytes(
        true,
        a.high,
        a.low,
        b.high,
        b.low,
        c.high,
        c.low,
        d.high,
        d.low
      );
    }
    default: {
      throw new Error(
        `Invalid type for scvalToBigNumber: ${scval?.switch().name}`
      );
    }
  }
}

function bigNumberFromBytes(
  signed: boolean,
  ...bytes: (string | number | bigint)[]
): BigNumber {
  // If the number is negative, the top bit is set.
  let sign = 1;
  if (signed && bytes[0] === 0x80) {
    sign = -1;
    bytes[0] &= 0x7f;
  }

  // Start with an initial value of zero.
  let b = BigInt(0);

  // Add each byte to the number.
  for (let byte of bytes) {
    b <<= BigInt(8);
    b |= BigInt(byte);
  }

  // Multiply by -1 if the number is negative.
  return BigNumber(b.toString()).multipliedBy(sign);
}

export function bigNumberToI128(value: BigNumber): SorobanClient.xdr.ScVal {
  const b: bigint = BigInt(value.toFixed(0));

  // Convert to a 16-byte two's complement integer.
  // The top bit is the sign bit.
  // https://en.wikipedia.org/wiki/Two%27s_complement
  const buf = bigintToBuf(b);

  // Ensure the value fits in 16 bytes.
  if (buf.length > 16) {
    throw new Error("BigNumber overflows i128");
  }

  // If the value is negative, clear the top bit.
  if (value.isNegative()) {
    buf[0] &= 0x7f;
  }

  // left-pad with zeros up to 16 bytes
  let padded = Buffer.alloc(16);
  buf.copy(padded, padded.length - buf.length);

  // If the value is negative, set the top bit.
  if (value.isNegative()) {
    padded[0] |= 0x80;
  }

  // Split the 16-byte integer into two 8-byte integers.
  const hi = new xdr.Int64(
    bigNumberFromBytes(false, ...padded.slice(4, 8)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(0, 4)).toNumber()
  );
  const lo = new xdr.Uint64(
    bigNumberFromBytes(false, ...padded.slice(12, 16)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(8, 12)).toNumber()
  );

  return xdr.ScVal.scvI128(new xdr.Int128Parts({ lo, hi }));
}

export function bigNumberToU128(value: BigNumber): SorobanClient.xdr.ScVal {
  const b: bigint = BigInt(value.toFixed(0));
  const buf = bigintToBuf(b);

  if (buf.length > 16) {
    throw new Error("BigNumber overflows i128");
  }

  // If the value is negative, clear the top bit.
  if (value.isNegative()) {
    buf[0] &= 0x7f;
  }

  // Left-pad with zeros up to 16 bytes.
  let padded = Buffer.alloc(16);
  buf.copy(padded, padded.length - buf.length);
  console.debug({ value: value.toString(), padded });

  // If the value is negative, set the top bit.
  if (value.isNegative()) {
    padded[0] |= 0x80;
  }

  const hi = new xdr.Uint64(
    bigNumberFromBytes(false, ...padded.slice(4, 8)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(0, 4)).toNumber()
  );

  const lo = new xdr.Uint64(
    bigNumberFromBytes(false, ...padded.slice(12, 16)).toNumber(),
    bigNumberFromBytes(false, ...padded.slice(8, 12)).toNumber()
  );

  return xdr.ScVal.scvU128(new xdr.UInt128Parts({ lo, hi }));
}

function bigintToBuf(n: bigint): Buffer {
  // Convert n to a hex string with no leading 0x or -
  // and with an even number of digits
  var hex = BigInt(n).toString(16).replace(/^-/, "");
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  // Convert the hex string to a Uint8Array
  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  // Set the top bit if n < 0
  if (n < BigInt(0)) {
    u8[0] |= 0x80;
  }

  return Buffer.from(u8);
}

export function xdrUint64ToNumber(value: SorobanClient.xdr.Uint64): number {
  let number = 0;
  number |= value.high;
  number <<= 8;
  number |= value.low;
  return number;
}
