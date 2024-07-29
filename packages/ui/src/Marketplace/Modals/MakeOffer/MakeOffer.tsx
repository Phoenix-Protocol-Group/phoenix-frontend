import React from "react";
import { Box, Grid, Modal, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Colors from "../../../Theme/colors";
import { TextInput, TextSelect } from "../../Shared";
import { Button } from "../../../Button/Button";
import { MakeOfferProps } from "@phoenix-protocol/types";

const MakeOffer = (props: MakeOfferProps) => {
  const getDateAfterDuration = () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + Number(props.duration) * 24 * 60 * 60 * 1000);
    return futureDate.toLocaleDateString();
  }

  const durationOptions = [{
    label: "7 Days",
    value: "7"
  }];

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
    padding: "24px",
  };

  return (
    <Modal
      open={props.open}
      aria-labelledby="makeoffer-modal"
      aria-describedby="Make Offer Modal"
    >
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "24px",
                fontWeight: 700,
                mb: 2,
              }}
            >
              Make Offer
            </Typography>
            <Box
              onClick={() => props.onClose()}
              component="img"
              sx={{
                alignSelf: "flex-start",
                w: "16px",
                h: "16px",
                backgroundColor: Colors.inputsHover,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              src="/x.svg"
            />
          </Box>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Grid container columnSpacing={3}>
                <Grid item xs="auto">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                      border: "0.5px solid var(--Border-Default, #2D303A)",
                      borderRadius: "12px",
                    }}
                  >
                    <ImageIcon
                      sx={{
                        fontSize: "18px",
                        color: "#CCCCCC",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#FFF",
                        fontSize: "18px",
                        lineHeight: "20.68px",
                      }}
                    >
                      {props.nftName}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#FFF",
                        fontSize: "18px",
                        lineHeight: "20.68px",
                      }}
                    >
                      {props.price} PHO
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#BFBFBF",
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                    >
                      {props.collectionName}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#BFBFBF",
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                    >
                      ${props.priceUsd}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                  border: "1px solid #2D303A",
                  borderRadius: "12px",
                }}
              >
                <Grid container rowSpacing={2}>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "24px",
                        fontWeight: 700,
                        color: "#BDBEBE",
                      }}
                    >
                      BALANCE
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: "#FFF",
                      }}
                    >
                      {props.balance} PHO
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "24px",
                        fontWeight: 700,
                        color: "#BDBEBE",
                      }}
                    >
                      FLOOR PRICE
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: "#FFF",
                      }}
                    >
                      {props.floorPrice} PHO
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "24px",
                        fontWeight: 700,
                        color: "#BDBEBE",
                      }}
                    >
                      BEST OFFER
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: "#FFF",
                      }}
                    >
                      {props.bestOffer} PHO
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  lineHeight: "17px",
                  color: "#BDBEBE",
                  mb: 1,
                }}
              >
                OFFER AMOUNT
              </Typography>
              <TextInput
                placeholder="0.00"
                value={props.offerAmount}
                onChange={props.onOfferAmountChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={3}>
                <Grid item xs={4}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "17px",
                      color: "#BDBEBE",
                      mb: 1,
                    }}
                  >
                    DURATION
                  </Typography>
                  <TextSelect items={durationOptions} value={props.duration} onChange={props.setDuration} placeholder="Select Duration" />
                </Grid>
                <Grid item xs={8}>
                <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "17px",
                      color: "#BDBEBE",
                      mb: 1,
                    }}
                  >
                    DURATION DATE
                  </Typography>
                  <TextInput value={props.duration ? getDateAfterDuration() : ""} placeholder="Select Duration" onChange={(val: string) => {}} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={1.5}>
                <Grid item xs={6}>
                  <Button label="Make Offer" onClick={props.onMakeOfferClick} />
                </Grid>
                <Grid item xs={6} sx={{
                  "& > div": {
                    width: "100% !important"
                  }
                }}>
                  <Button label="Buy PHO" type="secondary" onClick={props.onBuyPhoClick} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default MakeOffer;
