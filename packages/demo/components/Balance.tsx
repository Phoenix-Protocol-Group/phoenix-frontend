"use client";
import { useContractQuery } from "@phoenix-protocol/state/build/hooks/contracts";
import React, { useState } from "react";
import * as SorobanClient from "soroban-client";
import { useLoadToken, useSorobanReact } from "@phoenix-protocol/state";
import { convert } from "@phoenix-protocol/utils";

const Balance = ({ address, tokenId }: { address: string, tokenId: string }) => {
  const token = useLoadToken(
    tokenId,
    address,
    useSorobanReact()
  );
  // Convert the result ScVals to js types
  const tokenDecimals =
    token.decimals.result && (token.decimals.result?.u32() ?? 7);
  const tokenName =
    token.name.result && convert.scvalToString(token.name.result);
  // asset4 codes seem right-padded with null bytes, so strip those off
  let tokenSymbol = "";
  if (token.symbol.result) {
    tokenSymbol =
      convert.scvalToString(token.symbol.result)?.replace("\u0000", "") || "";
  }
  let balance = "0";
  if (token.userBalance.result) {
    balance = BigInt(token.userBalance.result.i128().lo()).toString();
  }
  return <div>${tokenSymbol}: {Number(balance) / 10 ** 7}</div>;
};
export default Balance;
