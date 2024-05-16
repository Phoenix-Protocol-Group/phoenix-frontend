import React from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Grid,
  CircularProgress,
} from "@mui/material";
import Colors from "../Theme/colors";
import { Button } from "../Button/Button";
import { DisclaimerModalProps } from "@phoenix-protocol/types";

const DisclaimerModal = ({ open, onAccepted }: DisclaimerModalProps): React.ReactNode => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 512,
    maxWidth: "calc(100vw - 16px)",
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  return (
    <MuiModal
      open={open}
      aria-labelledby="disclaimer-modal"
      aria-describedby="Disclaimer Message"
      sx={{
        zIndex: 1300
      }}
    >
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              onClick={() => onAccepted(false)}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Disclaimer
            </Typography>

            <Box>
              <Typography
                sx={{
                  color:
                    "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                  textAlign: "justify",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "140%",
                  marginBottom: "22px",
                  marginTop: "4px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                This agreement governs your use of the services provided through
                phoenix-hub.io, app.phoenix-hub.io or any of our related
                websites and/or applications (collectively, our “Services”). By
                clicking on “I Agree” below, you agree that you have read,
                understand and accept all of the terms and conditions contained
                below. For the avoidance of doubt, we do not provide
                investment, tax or legal advice, and you are solely responsible
                for determining whether any investment, strategy or transaction
                is appropriate for you based on your personal investment
                objectives, financial circumstances and risk tolerance. No
                information provided in connection with our Services is to be
                construed as (a) investment, tax or legal advice or as a
                recommendation or representation about the suitability or
                appropriateness of any product, service or investment or trading
                strategy, (b) an offer to buy or sell, or the solicitation of an
                offer to buy or sell, any security, financial product or
                instrument, or (c) an invitation to enter into any transaction.
                You should seek independent investment, tax or legal advice
                before making any decision, including with respect to any
                digital asset (including a virtual currency or virtual
                commodity) which is a digital representation of value based on
                (or built on top of) a cryptographic protocol of a computer
                network (“Digital Asset”). No part of our Services should be
                construed as a solicitation, recommendation or an offer to buy
                or sell any Digital Asset, security or investment or to engage
                in any transaction in any jurisdiction. We do not recommend that
                any Digital Asset should be bought, earned, sold or held by you.
                We will not be held responsible for the decisions you make to
                buy, sell or hold Digital Assets, whether or not based on the
                information provided in connection with our Services.   Unless
                otherwise specified, all performance figures shown in connection
                with our Services are for illustrative purposes only. Such
                performance figures are not indicative of future performance or
                results and are not guaranteed to materialize, and we do not
                guarantee such performance under any circumstances. As with any
                asset, the value of Digital Assets (and the income or rewards
                from them) can increase or decrease and there can be a
                substantial risk that you lose money buying, selling, holding,
                investing in or staking Digital Assets. You should consult your
                investment, tax or legal advisor regarding your specific
                situation and financial condition and carefully consider whether
                buying, selling, holding, investing in or staking Digital Assets
                is suitable for you.    Although the content provided in
                connection with our Services is based upon information that we
                consider reliable and endeavor to keep current, we do not assure
                that this material is accurate, current or complete, and it
                should not be relied upon as such. We do not warrant, either
                expressly or impliedly, the accuracy or completeness of the
                information, text, graphics, links or other items provided in
                connection with our Services and do not warrant that the related
                functions will be uninterrupted or error-free, that defects will
                be corrected or that the Services will be free of viruses or
                other harmful components. We expressly disclaim all liability
                for errors and omissions in the materials provided in connection
                with our Services and for the use or interpretation by others of
                such materials. We reserve the right to change, modify, add or
                remove our Services (or any part of our Services) without
                notice.
              </Typography>
              <Button onClick={() => onAccepted(true)} label="Accept"/>
            </Box>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { DisclaimerModal };
