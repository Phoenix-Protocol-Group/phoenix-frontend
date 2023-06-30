import { Box } from "@mui/material";

const AssetItem = ({
  label
}: {
  label: string
}) => {
  return (
    <Box sx={{
      padding: "8px",
      color: "white",
      fontSize: "14px",
      lineHeight: "140%",
      borderRadius: "8px",
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      "&:not(:last-of-type)": {
        marginBottom: "8px"
      }
    }}>
      {label}
    </Box>
  );
};

export default AssetItem;
