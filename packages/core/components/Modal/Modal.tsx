import { Modal as ModalUI, Token } from "@phoenix-protocol/ui";
import { useState } from "react";

export const SwapSuccess = ({
  tokens,
  setOpen,
  open,
  onTxClick,
}: {
  tokens: Token[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onTxClick: () => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={open}
    title="Successul Swap"
    tokens={tokens}
    setOpen={setOpen}
    onTxClick={onTxClick}
  />
);

export const SwapError = ({
  setOpen,
  open,
  error,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  error: string;
}) => (
  <ModalUI
    type="ERROR"
    open={open}
    title="Unsuccessul Swap"
    setOpen={setOpen}
    description={error}
  />
);
