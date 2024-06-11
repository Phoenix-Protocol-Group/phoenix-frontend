import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export interface ImageUploadProps {
  title: string;
  helpText?: string;
  onFileDrop: (file: File) => void;
  description1: string;
  description2?: string;
}

const ImageUpload = (props: ImageUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const textStyle = {
    fontSize: "14px",
    lineHeight: "24px",
    textAlign: {
      xs: "center",
      md: "unset",
    },
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
      props.onFileDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (event: any) => {
      if (event.target.files && event.target.files.length > 0) {
        props.onFileDrop(event.target.files[0]);
      }
    };
    fileInput.click();
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
        {props.title}{" "}
        {props.helpText && (
          <Tooltip title={props.helpText}>
            <HelpOutlineIcon
              sx={{
                ml: 1,
                fontSize: "16px",
                position: "relative",
                top: 3,
                "&:hover": { color: "#FFF" },
              }}
            />
          </Tooltip>
        )}
      </Typography>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          border: "1.5px solid #2C2C31",
          position: "relative",
          p: 3,
          borderRadius: "12px",
          display: "flex",
          boxShadow: "0px 6px 12px 0px #00000040 inset",
          overflow: "hidden",
          cursor: "pointer",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "center",
            md: "unset",
          },
          "&:hover": {
            border: "1px solid rgba(226, 98, 27, 0.6)",
          },
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
            mr: {
              xs: 0,
              md: 3,
            },
            mb: {
              xs: 2,
              md: 0,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
            border: "1px solid #2C2C31",
            borderRadius: "16px",
            height: {
              xs: "64px",
              md: "88px",
            },
            width: {
              xs: "64px",
              md: "88px",
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
              textAlign: {
                xs: "center",
                md: "unset",
              },
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
