"use client";
import MultistepForm from "@/components/NftForm";
import { Box } from "@mui/material";
import TermsAndConditions from "@/components/NftTerms";
import React, { useEffect } from "react";
import { Button } from "@phoenix-protocol/ui";
import { useAppStore } from "@phoenix-protocol/state";

export default function Page() {
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const appStore = useAppStore();
  useEffect(() => {
    appStore.setLoading(false);
  }, []);
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
