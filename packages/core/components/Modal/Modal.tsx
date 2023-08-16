import { Modal as ModalUI, Token } from "@phoenix-protocol/ui";
import { useState } from "react";

const copyToClipBoard = (error: string) => {
  const el = document.createElement("textarea");
  el.value = error;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);

  const selection = document.getSelection();

  if (selection) {
    const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }
  }
};

export const SwapSuccess = ({
  tokens,
  setOpen,
  open,
  onButtonClick,
}: {
  tokens: Token[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={open}
    title="Successul Swap"
    tokenTitles={["From:", "To:"]}
    tokens={tokens}
    setOpen={setOpen}
    onButtonClick={onButtonClick}
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
    description="There was a problem with your swap"
    error={error}
    onButtonClick={() => copyToClipBoard(error)}
  />
);

export const PoolSuccess = ({
  tokens,
  setOpen,
  open,
  onButtonClick,
}: {
  open: boolean;
  tokens: Token[];
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => {
  console.log(tokens);
  return (
    <ModalUI
      type="SUCCESS"
      open={open}
      title="Success"
      tokenTitles={["Token A:", "Token B:"]}
      tokens={tokens}
      setOpen={setOpen}
      onButtonClick={onButtonClick}
    />
  );
};

export const StakeSuccess = ({
  token,
  setOpen,
  open,
  onButtonClick,
}: {
  open: boolean;
  token: Token;
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={open}
    title="Success"
    tokenTitles={["Amount:"]}
    tokens={[token]}
    setOpen={setOpen}
    onButtonClick={onButtonClick}
  />
);

export const PoolError = ({
  setOpen,
  open,
  error,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  error: string;
}) => (
  <ModalUI
    type="ERROR"
    open={open}
    title="Error"
    setOpen={setOpen}
    error={error}
    onButtonClick={() => copyToClipBoard(error)}
  />
);
