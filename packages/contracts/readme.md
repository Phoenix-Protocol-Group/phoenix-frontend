# Contracts Package for Phoenix Frontend

The `Contracts` package is part of the larger Phoenix Frontend ecosystem and serves as a repository for generated contract classes and their associated types. This package is generated using [Soroban bindings](https://soroban.stellar.org/docs/getting-started/create-an-app#generate-an-npm-package-for-the-hello-world-contract).

## Features

- Generated contract classes for seamless integration with blockchain platforms.
- Types associated with each contract class for type safety.
- Soroban bindings for compatibility and extendibility.

## Installation

Navigate to the `Contracts` directory within the `/packages` directory of the main Phoenix Frontend project:

```bash
cd path-to-your-project/packages/Contracts
```

Run the following command to install all dependencies:

```bash
yarn install
```

## Usage

After installation, you can import the contract classes and types into your project as needed.

```typescript
import { ContractClassName } from '@phoenix-frontend/contracts';
```

Refer to the main Phoenix Frontend readme for guidance on how this package interacts with the other packages in the ecosystem.

## Additional Resources

For more information on generating contract classes and types, refer to the [Soroban documentation](https://soroban.stellar.org/docs/getting-started/create-an-app#generate-an-npm-package-for-the-hello-world-contract).
