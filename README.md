<p align="center">
  <img src="https://i.epvpimg.com/Rx1ddab.png" />
</p>

# Phoenix Frontend

Phoenix Frontend is built with TypeScript and leverages yarn workspaces for package management. You'll find multiple packages in the `/packages` directory, each serving a unique function in the overall application ecosystem. The project is optimized with Turborepo for efficient monorepo management.

## Packages

### [UI](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/ui)

Our `UI` package is an MUI-based UI kit, providing reusable components and styles in line with Material Design principles. It ensures a uniform and appealing visual experience across the app.

### [State](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/state)

The `State` package focuses on state management, incorporating zustand along with its actions to optimally manage and update the app's data based on user interactions and other events.

### [Utils](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/utils)

Housing a range of utility and helper functions, the `Utils` package offers a one-stop-shop for common tasks like data manipulation, date formatting, string handling, and network calls.

### [Core](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/core)

As the heart of the application, the `Core` package orchestrates the UI, state management, and utility functions. It's built on Next.js 15 and serves as the primary entry point, setting the architectural groundwork and facilitating inter-package interactions.

### [Contracts](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/contracts)

The `Contracts` package provides generated contract classes and associated types, created through Soroban bindings. For more information, refer to [Soroban's documentation](https://soroban.stellar.org/docs/getting-started/create-an-app#generate-an-npm-package-for-the-hello-world-contract).

### [Types](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/types)

The `Types` package contains TypeScript type definitions used throughout the Phoenix Frontend ecosystem, ensuring type consistency across all packages.

### [Strategies](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/strategies)

The `Strategies` package serves as a strategy provider registry for the Phoenix DeFi ecosystem, offering modular and extensible strategy implementations.

## Quick Start

### Setup Script

The easiest way to get started is to use the provided setup script:

```bash
./setup.sh
```

This script will:

1. Check for the correct Node.js version
2. Create a local environment file
3. Install dependencies
4. Build the required packages

### Development with Turborepo

This project uses Turborepo for efficient monorepo management. It optimizes builds, provides incremental builds, and manages dependencies between packages.

```bash
# Install dependencies
yarn install

# Start development with watch mode for all packages
yarn dev

# Run only the core app (Next.js)
yarn dev:core

# Run experimental features (if available)
yarn dev:experimental

# Run only the UI package development
yarn dev:ui

# Build all packages
yarn build

# Build specific packages
yarn build:core       # Build the core Next.js app
yarn build:contracts  # Build the contracts package
yarn build:state      # Build the state package
yarn build:ui         # Build the UI package
yarn build:utils      # Build the utils package
yarn build:types      # Build the types package
yarn build:strat      # Build the strategies package

# Run Storybook for the UI package
yarn storybook
```

#### Understanding the Development Process

When you run `yarn dev`, Turborepo will:

1. Build all necessary dependencies in the correct order
2. Start watch mode for all packages, rebuilding them when files change
3. Start the Next.js development server for the core package

This means you can edit files in any package, and changes will automatically be reflected in the running application without manual rebuilds.

## Project Structure

- `/packages/core` - Next.js application (main entry point)
- `/packages/ui` - UI component library based on Material UI
- `/packages/state` - State management with Zustand
- `/packages/utils` - Utility functions
- `/packages/types` - TypeScript type definitions
- `/packages/contracts` - Generated Soroban contract bindings
- `/packages/strategies` - Strategy provider registry for Phoenix DeFi
- `/schemas` - JSON schemas for project configuration

## Requirements

- Node.js (version specified in .nvmrc)
- Yarn package manager
- Git

## Reach Out

Questions, feedback, or suggestions? Feel free to connect with our dev team via [GitHub Issues](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/issues). We value your input!
