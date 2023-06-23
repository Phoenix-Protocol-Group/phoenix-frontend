import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  contractTransaction,
  useContractSign,
  useSorobanReact,
} from "@phoenix-protocol/state";
import { convert } from "@phoenix-protocol/utils";
import BigNumber from "bignumber.js";
import * as React from "react";
import * as SorobanClient from "soroban-client";

const Swap = ({
  server,
  address,
}: {
  server: SorobanClient.Server;
  address: string;
}) => {
  const [amount, setAmount] = React.useState<number>(0);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const sorobanContext = useSorobanReact();
  const { sendTransaction } = useContractSign();

  const doSwap = async (token: boolean) => {
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
        SorobanClient.xdr.ScVal.scvBool(token),
        convert.bigNumberToU128(new BigNumber(amount).shiftedBy(7)),
        SorobanClient.xdr.ScVal.scvVoid(),
        SorobanClient.xdr.ScVal.scvU64(new SorobanClient.xdr.Uint64(1, 1)),
      ];

      const tx = contractTransaction({
        networkPassphrase: networkPassphrase || "",
        source: walletSource,
        contractId:
          "b39b7afe36930c98d247fd203795d977bbef6f2fb617f1fe50532b45b10114ae",
        method: "swap",
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
    <>
      <Typography variant="h4">Swap</Typography>
      <TextField
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        label="Amount"
        fullWidth
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <LoadingButton
          loading={submitting}
          onClick={() => doSwap(true)}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          $PHO {"->"} $FAK
        </LoadingButton>
        <LoadingButton
          loading={submitting}
          variant="outlined"
          onClick={() => doSwap(false)}
        >
          $FAK {"->"} $PHO
        </LoadingButton>
      </Box>
    </>
  );
};
export default Swap;
