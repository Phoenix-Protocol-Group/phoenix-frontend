import React from "react";
import { Box, Button as MuiButton, Grid, Typography } from "@mui/material";
import { Button } from "../../Button/Button";
import NftSingleModal from "./NftSingleModal";
import NftSingleCard from "./NftSingleCard";

export interface NftSingleProps {
  listForSale?: boolean;
  listForSaleClick?: () => void;
  previewImage: string;
  collectionName: string;
  nftName: string;
  nftDescription: string;
  lastSale: string;
  bestOffer: string;
  floorPrice: string;
  owner: string;
  auctionEnds: Date;
  availableSupply: string;
  totalSupply: string;
  price: string;
  priceUsd: string;
}

const NftDescriptionItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Box>
    <Typography
      sx={{
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "12px",
        fontWeight: 700,
        lineHeight: "16.8px",
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color: "white",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const NftSingle = (props: NftSingleProps) => {
  const calculateTimeLeft = () => {
    const difference = props.auctionEnds.getTime() - new Date().getTime();
    let timeLeft: any;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<any>(calculateTimeLeft());

  const [traitsOpen, setTraitsOpen] = React.useState(true);
  const [priceHistoryOpen, setPriceHistoryOpen] = React.useState(true);
  const [offersOpen, setOffersOpen] = React.useState(true);
  const [activityOpen, setActivityOpen] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <Box>
      <NftSingleModal
        title="NFT Description"
        open={showFullDesc}
        onClose={() => setShowFullDesc(false)}
      >
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "16px",
            lineHeight: "22.4px",
          }}
        >
          {props.nftDescription}
        </Typography>
      </NftSingleModal>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={6}>
          <Grid container rowSpacing={5}>
            <Grid item xs={12}>
              <Box
                component="img"
                sx={{
                  maxWidth: "100%",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                  border: "0.5px solid #2D303A",
                }}
                alt="The house from the offer."
                src={props.previewImage}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "24px",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.6)",
              mb: 1,
            }}
          >
            {props.collectionName}
          </Typography>
          <Typography
            sx={{
              fontSize: "32px",
              lineHeight: "37px",
              fontWeight: 700,
              color: "white",
              mb: 3,
            }}
          >
            {props.nftName}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "22.4px",
              color: "rgba(255, 255, 255, 0.6)",
              mb: 6,
            }}
          >
            {props.nftDescription.substring(0, 300)}...
            {props.nftDescription.length > 300 && (
              <MuiButton
                size="small"
                onClick={() => setShowFullDesc(true)}
                sx={{
                  color: "white",
                  fontSize: "16px",
                  lineHeight: "22.4px",
                  textTransform: "unset",
                }}
              >
                Read More
              </MuiButton>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              mb: 7,
            }}
          >
            <NftDescriptionItem label="Last Sale" value={props.lastSale} />
            <NftDescriptionItem label="Best Offer" value={props.bestOffer} />
            <NftDescriptionItem label="Floor Price" value={props.floorPrice} />
            <NftDescriptionItem
              label="Owner"
              value={`${props.owner.substring(0, 4)}...${props.owner.substring(
                props.owner.length - 4
              )}`}
            />
          </Box>
          {props.listForSale ? (
            <Button onClick={props.listForSaleClick} sx={{width: "auto"}} label="List for Sale"></Button>
          ) : (
            <Box
              sx={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                border: "1px solid #2D303A",
                padding: "32px 24px",
                borderRadius: "16px",
              }}
            >
              <Grid container rowSpacing={3}>
                <Grid item xs={7}>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16.8px",
                      mb: 1,
                    }}
                  >
                    AUCTION ENDS
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 700,
                      lineHeight: "23px",
                    }}
                  >
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                    {timeLeft.seconds}s
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={5}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16.8px",
                      mb: 1,
                    }}
                  >
                    AVAILABLE
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 700,
                      lineHeight: "23px",
                    }}
                  >
                    {props.availableSupply} of {props.totalSupply}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16.8px",
                      mb: 1,
                    }}
                  >
                    PRICE
                  </Typography>
                  <Box display="flex">
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: 700,
                        lineHeight: "23px",
                        mr: 1,
                      }}
                    >
                      {props.price}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#BDBEBE",
                        fontSize: "20px",
                        fontWeight: 700,
                        lineHeight: "23px",
                      }}
                    >
                      (${props.priceUsd})
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  gap={1.5}
                  sx={{
                    display: "flex",
                    "& > div": {
                      width: "50% !important",
                    },
                    "& button": {
                      width: "100%",
                    },
                  }}
                >
                  <Button label="Buy now" />
                  <Button label="Make Offer" type="secondary" />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftSingle;
