import React from "react";
import { Box, Container, Typography } from "@mui/material";

const TermsAndConditions: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Become a DEGENesis Artist on Phoenix!
        </Typography>
        <Typography paragraph>
          This form is for prospective artists who want to have their collection
          live on Phoenix Day 1 when the NFT Marketplace launches. Being genesis
          creators has several benefits. Phoenix will feature these collections
          within the marketplace. We will also host a Twitter/X space with the
          creators. Finally, we will create a Discord chat for your collections.
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          We look forward to your submissions and can't wait to launch!
        </Typography>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions for Genesis NFT Artists
        </Typography>
        <Typography variant="h6" gutterBottom>
          1. Quality Standards
        </Typography>
        <Typography paragraph>
          All submissions must be original, high-quality artwork. Low-quality or
          incomplete artwork will not be accepted.
        </Typography>
        <Typography variant="h6" gutterBottom>
          2. Prohibited Content
        </Typography>
        <Typography paragraph>
          No illegal content of any kind, including but not limited to
          copyrighted material without permission. - No sexual content, explicit
          imagery, or adult themes. - No content that promotes hate, violence,
          harassment, or discrimination of any kind. - No offensive or
          inappropriate content that violates community standards.
        </Typography>
        <Typography variant="h6" gutterBottom>
          3. Legal Compliance
        </Typography>
        <Typography paragraph>
          All submissions must comply with the laws and regulations of the
          country of operation. - Artists must ensure their work does not
          infringe on any intellectual property rights.
        </Typography>
        <Typography variant="h6" gutterBottom>
          4. Artist Verification
        </Typography>
        <Typography paragraph>
          Artists must provide accurate and complete information for
          verification purposes. - Any false information provided may result in
          disqualification and removal from the platform.
        </Typography>
        <Typography variant="h6" gutterBottom>
          5. Submission Rights
        </Typography>
        <Typography paragraph>
          By submitting artwork, artists grant the platform the right to display
          and promote their work. - Artists retain full ownership of their
          artwork unless otherwise agreed upon in writing.
        </Typography>
        <Typography variant="h6" gutterBottom>
          6. Ethical Standards
        </Typography>
        <Typography paragraph>
          Artists are expected to adhere to ethical standards, maintaining
          integrity and respect in their interactions. - Plagiarism or any form
          of art theft will result in immediate disqualification.
        </Typography>
        <Typography variant="h6" gutterBottom>
          7. Review Process
        </Typography>
        <Typography paragraph>
          All submissions will undergo a review process to ensure they meet the
          platform’s standards and guidelines. - The platform reserves the right
          to reject any submission that does not meet the outlined criteria.
        </Typography>
        <Typography variant="h6" gutterBottom>
          8. Dispute Resolution
        </Typography>
        <Typography paragraph>
          Any disputes arising from the submission and review process will be
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          resolved through mediation in accordance with the platform's dispute
          resolution policies.
        </Typography>
        <Typography variant="h6" gutterBottom>
          9. Amendments
        </Typography>
        <Typography paragraph>
          The platform reserves the right to amend these terms and conditions at
          any time. Artists will be notified of any changes.
        </Typography>
        <Typography variant="h6" gutterBottom>
          10. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By submitting artwork, artists acknowledge and agree to abide by these
          terms and conditions.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsAndConditions;
