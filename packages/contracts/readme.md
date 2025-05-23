# Contracts Package for Phoenix Frontend

The `Contracts` package is part of the larger Phoenix Frontend ecosystem and serves as a repository for generated contract classes and their associated types. This package is generated using [Soroban bindings](https://soroban.stellar.org/docs/getting-started/create-an-app#generate-an-npm-package-for-the-hello-world-contract) for seamless integration with the Stellar Soroban platform.

## Features

- Generated contract classes for Phoenix Protocol contracts
- TypeScript types for contract interactions
- Soroban bindings for the Stellar blockchain
- Predefined contract interaction methods
- Helper functions for interacting with Phoenix protocol

## Included Contracts

- `phoenix-factory` - Factory contract for creating and managing token pairs
- `phoenix-multihop` - Contract for multi-hop swaps between different token pairs
- `phoenix-pair` - Liquidity pair contract for token swaps
- `phoenix-stake` - Staking contract for liquidity provider rewards
- `phoenix-vesting` - Vesting contract for token distribution
- `soroban-token` - Token contract implementation for Soroban

## Installation

Navigate to the root directory of the Phoenix Frontend project:

```bash
cd /path/to/phoenix/frontend
```

Run the following command to install all dependencies:

```bash
yarn install
```

Build the contracts package:

```bash
yarn build:contracts
```

## Usage

After installation, you can import the contract classes and types into your project as needed:

```typescript
import {
  PhoenixPairClient,
  PhoenixFactoryClient,
  PhoenixMultihopClient,
} from "@phoenix-protocol/contracts";

// Initialize a contract client
const pairClient = new PhoenixPairClient({
  contractId: "your_contract_id",
  networkPassphrase: "your_network_passphrase",
  rpcUrl: "your_rpc_url",
});

// Interact with the contract
const poolInfo = await pairClient.getPoolInfo();
```

## Fetching PHO Token

This package also includes a utility for fetching PHO tokens from the faucet:

```typescript
import { fetchPho } from "@phoenix-protocol/contracts";

// Fetch PHO tokens to your wallet
await fetchPho(walletPublicKey);
```

## Additional Resources

For more information on Soroban contracts and Stellar development:

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Developers Guide](https://developers.stellar.org/docs)
- [Phoenix Protocol Documentation](https://docs.phoenix-protocol.io)
