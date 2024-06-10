import React from "react";
import { Box, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export interface ImageUploadProps {
  title: string;
  onFileDrop: (file: File) => void;
  description1: string;
  description2?: string;
}

const ImageUpload = (props: ImageUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const textStyle = {
    fontSize: "14px",
    lineHeight: "24px",
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      props.onFileDrop(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: "12px",
          lineHeight: "17px",
          mb: 1.5,
          color: "#BFBFBF",
        }}
      >
        {props.title}
      </Typography>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "1.5px solid #2C2C31",
          position: "relative",
          p: 3,
          borderRadius: "12px",
          display: "flex",
          boxShadow: "0px 6px 12px 0px #00000040 inset",
          overflow: "hidden",
          "&:after": {
            content: "' '",
            position: "absolute",
            top: isDragging ? "0px" : "100%",
            transition: "top 0.5s ease 0s",
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(360deg, rgba(226, 73, 26, 0.19) 0%, rgba(226, 73, 26, 0) 100%)",
          },
        }}
      >
        <Box
          sx={{
            mr: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
            border: "1px solid #2C2C31",
            borderRadius: "16px",
            height: {
              xs: "88px",
            },
            width: {
              xs: "88px",
            },
          }}
        >
          <UploadFileIcon
            sx={{
              fontSize: "24px",
              color: "#808080",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "21px",
            }}
          >
            Drag and drop or click to upload
          </Typography>
          <Typography sx={textStyle}>{props.description1}</Typography>
          {props.description2 && (
            <Typography sx={textStyle}>{props.description2}</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ImageUpload;
