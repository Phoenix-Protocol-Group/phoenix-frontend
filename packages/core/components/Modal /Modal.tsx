import { Modal as ModalUI, Token } from "@phoenix-protocol/ui";
import { useState } from "react";

const swapSuccess = ({
  tokens,
  setOpen
}: {
  tokens: Token[];
  setOpen: (open: boolean) => void;
}) => (
  <ModalUI
    type="SUCCESS"
    open={false}
    title="Successul Swap"
    tokens={tokens}
    setOpen={setOpen}
  />
);

const Modal = () => {
  const setOpen = (open: boolean) => {

  };

  return (
    
  );
};

export default Modal;
