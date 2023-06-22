import React, { useState } from "react";
import * as SorobanClient from "soroban-client";
import { convert } from "@phoenix-protocol/utils";
import BigNumber from "bignumber.js";
import { Box, TextField, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  contractTransaction,
  useContractSign,
  useSorobanReact,
} from "@phoenix-protocol/state";

const ProvideLp = ({
  server,
  address,
}: {
  server: SorobanClient.Server;
  address: string;
}) => {
  const sorobanContext = useSorobanReact();
  const { sendTransaction } = useContractSign();
  const [submitting, setSubmitting] = useState(false);
  const [amounts, setAmounts] = useState({ a: 0, b: 0 });

  const doProvideLp = async () => {
    setSubmitting(true);
    if (!server) throw new Error("Not connected to server");
    const networkPassphrase = sorobanContext.activeChain?.networkPassphrase;
    let walletSource;
    try {
      walletSource = await server.getAccount(address);
    } catch (error) {
      console.log(error);
      alert("Your wallet or the token admin wallet might not be funded");
      setSubmitting(false);
      return;
    }

    try {
      const params = [
        new SorobanClient.Address(address || "").toScVal(),
        convert.bigNumberToU128(new BigNumber(amounts.a).shiftedBy(7)),
        convert.bigNumberToU128(new BigNumber(amounts.a).shiftedBy(7)),
        convert.bigNumberToU128(new BigNumber(amounts.b).shiftedBy(7)),
        convert.bigNumberToU128(new BigNumber(amounts.b).shiftedBy(7)),
      ];

      const tx = contractTransaction({
        networkPassphrase: networkPassphrase || "",
        source: walletSource,
        contractId:
          "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae",
        method: "provide_liquidity",
        params: params,
      });
      let result = await sendTransaction(tx, {
        sorobanContext,
        skipAddingFootprint: true,
      });

      console.debug(result);
    } catch (err) {
      console.debug("TX Error: ", err);
    }

    setSubmitting(false);
  };

  return (
    <Box width="100%">
      <Typography variant="h6">Provide Liquidity</Typography>
      <TextField
        value={amounts.a}
        onChange={(e) => setAmounts({ ...amounts, a: Number(e.target.value) })}
        fullWidth
        label="PHO"
        variant="standard"
      />
      <TextField
        value={amounts.b}
        onChange={(e) => setAmounts({ ...amounts, b: Number(e.target.value) })}
        fullWidth
        label="FAK"
        variant="standard"
      />
      <LoadingButton
        onClick={() => doProvideLp()}
        sx={{ mt: 2 }}
        fullWidth
        variant="contained"
        loading={submitting}
      >
        Provide!
      </LoadingButton>
    </Box>
  );
};

export default ProvideLp;
