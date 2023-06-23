import React from "react";
import { Typography } from "@mui/material";

function WelcomeMessage() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Phoenix Demo UI!
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Experience the Power of On-Chain Token Swapping</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for joining us in exploring the capabilities of the Phoenix
        project. In this demo, you can witness the seamless swapping of tokens
        directly on the blockchain using our smart contracts.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>
          Please Note: Querying Functionality is Not Yet Available
        </strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        While the ability to query data is not yet implemented in this version
        of the demo, you can still dive into the exciting world of decentralized
        exchanges by experiencing secure and efficient on-chain token swaps.
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Get Started and Swap Tokens</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. Connect your wallet to the demo UI.
      </Typography>
      <Typography variant="body1" gutterBottom>
        2. Select the tokens you wish to swap.
      </Typography>
      <Typography variant="body1" gutterBottom>
        3. Review and confirm the transaction details.
      </Typography>
      <Typography variant="body1" gutterBottom>
        4. Experience the power of instant token swapping on the chain!
      </Typography>
      <Typography variant="body1" gutterBottom>
        We appreciate your interest and encourage you to explore the Phoenix
        Frontend repository for more insights and contribute to the project's
        development.
      </Typography>
      <Typography variant="body1" gutterBottom>
        GitHub Repository for Frontend:{" "}
        <a href="https://github.com/placeholder_frontend_repo">
          Placeholder Frontend Repository
        </a>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Discover the underlying technology and implementation details of our
        smart contracts in the Phoenix Smart Contracts repository.
      </Typography>
      <Typography variant="body1" gutterBottom>
        GitHub Repository for Smart Contracts:{" "}
        <a href="https://github.com/placeholder_smart_contracts_repo">
          Placeholder Smart Contracts Repository
        </a>
      </Typography>
    </>
  );
}

export default WelcomeMessage;
