# Strategies Package

The `Strategies` package serves as a strategy provider registry for the Phoenix DeFi ecosystem. It integrates with other packages in the Phoenix Frontend to provide modular and extensible strategy implementations.

## Features

- Strategy provider registry for Phoenix DeFi
- Integration with Phoenix contracts
- Debug utilities for strategy development and testing
- Type-safe implementation using TypeScript

## Installation

To install the Strategies package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.

## Usage

To use the Strategies package in your application:

```typescript
import { registry } from "@phoenix-protocol/strategies";

// Access registered strategies
const strategies = registry.getStrategies();

// Or use specific strategy implementations
import { SomeStrategy } from "@phoenix-protocol/strategies/phoenix";
```

## Development

To work on the Strategies package:

1. Make changes to the files in the `src` directory
2. Run `yarn build` or `yarn dev` to build the package
3. Test your changes by importing the package in other parts of the Phoenix Frontend

The package uses TypeScript for type safety and provides debugging utilities to help with development and testing.
