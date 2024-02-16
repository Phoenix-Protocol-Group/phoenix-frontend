import { Modal as ModalUI } from "@phoenix-protocol/ui";
import { Token } from "@phoenix-protocol/types";

function copyToClipBoard(error: string) {
  navigator.clipboard.writeText(error);
}

export const SwapSuccess = ({
  tokens,
  tokenAmounts,
  setOpen,
  open,
  onButtonClick,
}: {
  tokens: Token[];
  tokenAmounts: number[];
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
    tokenAmounts={tokenAmounts}
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
    title="Unsuccessful Swap"
    setOpen={setOpen}
    description="There was a problem with your swap"
    error={error}
    onButtonClick={() => copyToClipBoard(error)}
  />
);

export const PoolSuccess = ({
  tokens,
  tokenAmounts,
  setOpen,
  open,
  onButtonClick,
}: {
  open: boolean;
  tokens: Token[];
  tokenAmounts: number[];
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => {
  return (
    <ModalUI
      type="SUCCESS"
      open={open}
      title="Success"
      tokenTitles={["Token A:", "Token B:"]}
      tokens={tokens}
      tokenAmounts={tokenAmounts}
      setOpen={setOpen}
      onButtonClick={onButtonClick}
    />
  );
};

export const UnstakeSuccess = ({
  token,
  tokenAmounts,
  setOpen,
  open,
  onButtonClick,
}: {
  open: boolean;
  token: Token;
  tokenAmounts: number[];
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={open}
    title="Successfully Unstaked"
    tokenTitles={["Amount:"]}
    tokens={[token]}
    tokenAmounts={tokenAmounts}
    setOpen={setOpen}
    onButtonClick={onButtonClick}
  />
);

export const StakeSuccess = ({
  token,
  tokenAmounts,
  setOpen,
  open,
  onButtonClick,
}: {
  open: boolean;
  token: Token;
  tokenAmounts: number[];
  setOpen: (open: boolean) => void;
  onButtonClick: () => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={open}
    title="Successfully Staked"
    tokenTitles={["Amount:"]}
    tokens={[token]}
    tokenAmounts={tokenAmounts}
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

export const Loading = ({
  setOpen,
  open,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <ModalUI
    title=""
    type="LOADING"
    open={open}
    description="Transaction broadcasting..."
    setOpen={setOpen}
  />
);

export const LoadingSwap = ({
  setOpen,
  open,
  fromToken,
  toToken,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  fromToken: Token;
  toToken: Token;
}) => (
  <ModalUI
    title=""
    type="LOADING_SWAP"
    open={open}
    description="Transaction broadcasting..."
    setOpen={setOpen}
    tokens={[fromToken, toToken]}
  />
);
