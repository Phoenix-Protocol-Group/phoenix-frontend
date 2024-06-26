import { Box, Grid, Typography } from "@mui/material";
import { NftListingEntryProps } from "./NftListing";
import { Button } from "../../../Button/Button";

const NftListingEntry = (props: NftListingEntryProps) => {
  return (
    <Box position="relative">
      <Box
        component="img"
        sx={{
          maxWidth: "100%",
          border: "1px solid #2C2C31",
          borderRadius: "16px",
        }}
        alt="Preview Image"
        src={props.image}
      />
      <Typography
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          fontWeight: 700,
          size: "14px",
          lineHeight: "16px",
        }}
      >
        #{props.id}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          p: 2,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) -1.56%, #000000 63.02%)",
          borderBottomRightRadius: "16px",
          borderBottomLeftRadius: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            lineHeight: "16px",
            fontWeight: 500,
            color: "#BDBEBE",
          }}
        >
          {props.collectionName}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "16px",
            fontWeight: 700,
            color: "#FFF",
            mb: 2,
          }}
        >
          {props.nftName}
        </Typography>
        <Grid container>
          {props.listForSale ? (
            <Grid item xs={12}>
              <Button 
                sx={{
                  padding: "12px 40px 12px 40px"
                }}
                label="List For Sale"
                onClick={() => props._listForSaleClick(props.id)}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    lineHeight: "16px",
                    fontWeight: 500,
                    color: "#BDBEBE",
                  }}
                >
                  Price
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    sx={{
                      width: "16px",
                      mr: 0.5,
                    }}
                    alt="pho icon"
                    src="/cryptoIcons/pho.svg"
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      lineHeight: "24px",
                      color: "#FFF",
                    }}
                  >
                    {props.price}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    lineHeight: "16px",
                    fontWeight: 500,
                    color: "#BDBEBE",
                    textAlign: "right",
                  }}
                >
                  Owned by
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    color: "#FFF",
                    textAlign: "right",
                  }}
                >
                  {props.ownedBy}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default NftListingEntry;
