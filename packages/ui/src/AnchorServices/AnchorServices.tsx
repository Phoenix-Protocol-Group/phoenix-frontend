import { Box, Button, Link, Modal, Typography } from "@mui/material";
import { Button as PhoenixButton } from "../Button/Button";
import { Anchor, Token, AnchorServicesProps } from "@phoenix-protocol/types";
import React, { useEffect } from "react";
import Colors from "../Theme/colors";
import { AssetSelector } from "../Swap";
import { motion } from "framer-motion";

const AssetButton = ({
  token,
  onClick,
  hideDropdownButton = false,
}: {
  token: Token;
  onClick?: () => void;
  hideDropdownButton?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        fontSize: "14px",
        padding: "4px",
        borderRadius: "8px",
        background: hideDropdownButton
          ? "none"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        display: "inline-flex",
        color: "white",
        "&:hover": {
          background: hideDropdownButton ? "none" : "rgba(226, 87, 28, 0.08)",
        },
        cursor: hideDropdownButton ? "auto" : "pointer",
        pointerEvents: hideDropdownButton ? "none" : "auto",
      }}
    >
      <Box
        component={"img"}
        src={token.icon}
        sx={{
          maxWidth: "24px",
          marginRight: "8px",
        }}
      />
      {token.name}
      <Box
        component={"img"}
        src="/CaretDown.svg"
        sx={{
          display: hideDropdownButton ? "none" : "block",
        }}
      />
    </Button>
  );
};

const AnchorListItem = ({
  anchor,
  selected,
  onClick,
}: {
  anchor: Anchor;
  selected: string;
  onClick?: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "1.5rem 1rem",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius: "0.5rem",
        background:
          selected === anchor.name
            ? "linear-gradient(97deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.23%, rgba(226, 73, 26, 0.20) 43.08%, rgba(226, 170, 27, 0.20) 100.88%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        cursor: "pointer",
        border:
          selected === anchor.name
            ? "1px solid #E2571C"
            : "1px solid rgba(77, 79, 80, 0.30)",
        mt: "0.5rem",
      }}
      onClick={onClick}
    >
      <Box component="img" src={anchor.logo} height="1.5rem" />
    </Box>
  );
};

const StepOne = ({
  assetSelectorOpen,
  selectedAnchor,
  setAssetSelectorOpen,
  selected,
  anchors,
  setSelected,
  setStep,
}) => {
  return assetSelectorOpen ? (
    <AssetSelector
      tokens={selectedAnchor.tokens}
      tokensAll={selectedAnchor.tokens}
      onClose={() => setAssetSelectorOpen(false)}
      onTokenClick={() => {}}
      hideQuickSelect={true}
    />
  ) : (
    <>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.70)",
          fontFamily: "Ubuntu",
        }}
      >
        Select an anchor to connect to:
      </Typography>
      <Box>
        {anchors.map((anchor) => (
          <AnchorListItem
            anchor={anchor}
            selected={selected}
            key={anchor.name}
            onClick={() => setSelected(anchor.name)}
          />
        ))}
      </Box>
      <Box
        sx={{
          background:
            "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
          padding: "10px 16px",
          borderRadius: "16px",
          border: "1px solid #E2621B",
          mt: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Select currency to deposit:
        </Typography>
        <AssetButton
          token={selectedAnchor.tokens[0]}
          onClick={() => setAssetSelectorOpen(true)}
        />
      </Box>
      <Box
        sx={{
          background:
            "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
          padding: "10px 16px",
          borderRadius: "16px",
          border: "1px solid #E2621B",
          mt: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Select token to recieve:
        </Typography>
        <AssetButton
          token={selectedAnchor.tokens[0]}
          onClick={() => setAssetSelectorOpen(true)}
        />
      </Box>
      <PhoenixButton
        sx={{ mt: "2rem" }}
        label="Next"
        onClick={() => setStep(2)}
      />
    </>
  );
};

const StepTwo = ({ selected, setStep }) => (
  <>
    <Typography
      sx={{
        fontSize: "0.875rem",
        fontStyle: "normal",
        fontWeight: 400,
        color: "rgba(255, 255, 255, 0.70)",
        fontFamily: "Ubuntu",
      }}
    >
      How would you like to complete the transaction?
    </Typography>
    <Box
      sx={{
        display: "flex",
        padding: "1.5rem 1rem",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius: "0.5rem",
        background: !selected
          ? "linear-gradient(97deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.23%, rgba(226, 73, 26, 0.20) 43.08%, rgba(226, 170, 27, 0.20) 100.88%)"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        cursor: "pointer",
        border: !selected
          ? "1px solid #E2571C"
          : "1px solid rgba(77, 79, 80, 0.30)",
        mt: "0.5rem",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          SEP-0006 (Coming Soon!)
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.70)",
            fontFamily: "Ubuntu",
          }}
        >
          This SEP defines the standard way for anchors and wallets to interact
          on behalf of users. This improves user experience by allowing wallets
          and other clients to interact with anchors directly without the user
          needing to leave the wallet to go to the anchor's site.{" "}
          <Link
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md"
            target="_blank"
          >
            Learn more
          </Link>
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        padding: "1.5rem 1rem",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius: "0.5rem",
        background: selected
          ? "linear-gradient(97deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.23%, rgba(226, 73, 26, 0.20) 43.08%, rgba(226, 170, 27, 0.20) 100.88%)"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        cursor: "pointer",
        border: selected
          ? "1px solid #E2571C"
          : "1px solid rgba(77, 79, 80, 0.30)",
        mt: "0.5rem",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          SEP-0024
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.70)",
            fontFamily: "Ubuntu",
          }}
        >
          It is based on SEP-0006, but only supports the interactive flow, and
          cleans up or removes confusing artifacts. If you are updating from
          SEP-0006 see the changes from SEP-6 at the bottom of this document.{" "}
          <Link
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md"
            target="_blank"
          >
            Learn more
          </Link>
        </Typography>
      </Box>
    </Box>
    <PhoenixButton
      sx={{ mt: "1rem", mb: "0.5rem" }}
      label="Next"
      onClick={() => setStep(3)}
    />
    <PhoenixButton type="secondary" label="Back" onClick={() => setStep(1)} />
  </>
);

const StepThree = ({ authenticate, sign, send, step, close }) => {
  // State for current status
  const [status, setStatus] = React.useState(0);

  const start = async () => {
    setStatus(1);
    await authenticate();
    setStatus(2);
    await sign();
    setStatus(3);
    await send();
    setStatus(4);
  };

  useEffect(() => {
    if (step === 3) {
      start();
    }
  }, [step]);

  return (
    <>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.70)",
          fontFamily: "Ubuntu",
        }}
      >
        Alright, let's go!
      </Typography>
      {status >= 0 && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ type: "linear", stiffness: 100, duration: 1 }}
        >
          <AnchorStatus text="Connecting to anchor..." />
        </motion.div>
      )}
      {status >= 1 && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ type: "linear", stiffness: 100, duration: 1 }}
        >
          <AnchorStatus text="Anchor needs a SEP-10 Authentication, please wait..." />
        </motion.div>
      )}
      {status >= 2 && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ type: "linear", stiffness: 100, duration: 1 }}
        >
          <AnchorStatus text="Authenticated!" />
        </motion.div>
      )}
      {status >= 3 && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ type: "linear", stiffness: 100, duration: 1 }}
        >
          <AnchorStatus text="Starting SEP-0024 interactive mode..." />
        </motion.div>
      )}
      {status >= 4 && (
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "-100vw" }}
          transition={{ type: "linear", stiffness: 100, duration: 1 }}
        >
          <AnchorStatus text="Please continue in the popup window." />
          <PhoenixButton sx={{ mt: 1 }} label="Close" onClick={close} />
        </motion.div>
      )}
    </>
  );
};

const AnchorStatus = ({ text }: { text: string }) => (
  <Box
    sx={{
      display: "flex",
      padding: "1.5rem 1rem",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      borderRadius: "0.5rem",
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      cursor: "pointer",
      border: "1px solid rgba(77, 79, 80, 0.30)",
      mt: "0.5rem",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.875rem",
        fontFamily: "Ubuntu",
        opacity: 0.8,
      }}
    >
      {text}
    </Typography>
  </Box>
);

export const AnchorServices = ({
  anchors,
  open,
  authenticate,
  sign,
  send,
  setOpen,
}: AnchorServicesProps) => {
  // State for selected anchor name
  const [selected, setSelected] = React.useState<string>(anchors[0].name);

  // State for selected anchor
  const [selectedAnchor, setSelectedAnchor] = React.useState<Anchor>(
    anchors[0]
  );

  // State for asset selector opened
  const [assetSelectorOpen, setAssetSelectorOpen] = React.useState(false);

  // State for current step
  const [step, setStep] = React.useState(1);

  // Use Effect Hook for anchor on select change
  useEffect(() => {
    setSelectedAnchor(anchors.find((a) => a.name === selected)!);
  }, [selected]);

  // Some Modal Styles
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxWidth: "100%",
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="connectwallet-modal"
      aria-describedby="connect your wallet to the app"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: "1rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Ubuntu",
              fontSize: "1.125rem",
              fontWeight: 700,
            }}
          >
            Buy Crypto
          </Typography>
          <Box
            onClick={() => setOpen(false)}
            component="img"
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              w: "16px",
              h: "16px",
              backgroundColor: Colors.inputsHover,
              borderRadius: "8px",
              cursor: "pointer",
            }}
            src="/x.svg"
          />
        </Box>
        {step === 1 && (
          <StepOne
            assetSelectorOpen={assetSelectorOpen}
            selectedAnchor={selectedAnchor}
            setAssetSelectorOpen={setAssetSelectorOpen}
            selected={selected}
            anchors={anchors}
            setSelected={setSelected}
            setStep={setStep}
          />
        )}
        {step === 2 && <StepTwo selected={selected} setStep={setStep} />}
        {step === 3 && (
          <StepThree
            authenticate={() => authenticate(selectedAnchor)}
            sign={() => sign(selectedAnchor)}
            send={() => send(selectedAnchor)}
            step={step}
            close={() => {
              setOpen(false);
              setStep(0);
            }}
          />
        )}
      </Box>
    </Modal>
  );
};
