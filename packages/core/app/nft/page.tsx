"use client";
import MultistepForm from "@/components/NftForm";
import { Box } from "@mui/material";
import TermsAndConditions from "@/components/NftTerms";
import React from "react";
import { Button } from "@phoenix-protocol/ui";

export default function Page() {
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  return (
    <Box sx={{ mt: 6 }}>
      {acceptedTerms ? (
        <MultistepForm />
      ) : (
        <Box>
          <TermsAndConditions />{" "}
          <Button onClick={() => setAcceptedTerms(!acceptedTerms)}>
            Accept Terms
          </Button>
        </Box>
      )}
    </Box>
  );
}
