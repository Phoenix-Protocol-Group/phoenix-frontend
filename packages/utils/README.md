# Utils Package

The `Utils` package offers a range of utility and helper functions tailored for the Phoenix Frontend application. It covers various tasks like data manipulation, string operations, network interactions with Stellar blockchain, and more.

## Features

- Stellar blockchain interaction utilities
- Formatting helpers for currency, numbers, and dates
- Type conversion and validation functions
- Network and API request helpers
- Testing utilities

## Installation

1. Make sure Node.js and yarn are installed on your system.
2. Navigate to the Phoenix Frontend project root directory.
3. Run the following command to install all dependencies:

   ```bash
   yarn install
   ```

## Usage

To incorporate the Utils package into your project:

1. Import the required utility functions:

   ```typescript
   import { formatAmount, parseTokenAmount } from "@phoenix-protocol/utils";
   ```

2. Use the imported functions as needed:

   ```typescript
   // Format an amount for display
   const displayAmount = formatAmount("1000000", 7); // "100.0000000"

   // Parse a token amount from user input
   const tokenAmount = parseTokenAmount("100", 7); // "1000000"
   ```

3. For blockchain-specific utilities:

   ```typescript
   import { getStellarServer, getTxBuilder } from "@phoenix-protocol/utils";

   // Get a configured Stellar server instance
   const server = getStellarServer();

   // Create a transaction builder
   const txBuilder = getTxBuilder(publicKey);
   ```

## Development

To develop or extend the Utils package:

1. Make changes to the files in the `src` directory
2. Run `yarn build:utils` or `yarn dev` from the project root to build the package
3. Import and use your changes in other packages

## Testing

To run tests for the Utils package, execute:

```bash
yarn test
```

This will run all test cases for the utility functions, ensuring they operate as expected.
