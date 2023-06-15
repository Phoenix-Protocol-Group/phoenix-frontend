# State Package

The State package is a collection of state management utilities for the Phoenix Frontend project. It utilizes React Query, a powerful library for managing and caching asynchronous data. The package includes various providers that integrate with React Query and enable efficient state management across the application.
This package started heavily inspired by [soroban-react](https://github.com/esteblock/soroban-react).

## Installation

To install the State package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.
4. Navigate to the `/packages/state` directory.

## Usage

To use the State package in your application, follow these steps:

1. Import the desired state providers from the State package into your project.
2. Wrap your components with the imported state providers to access the provided state management functionalities.
3. Utilize the available hooks and utilities provided by React Query to manage and interact with the application's state.
4. Customize the state management as needed, utilizing the options and configurations available in React Query and the State package.

## Providers

The State package provides the following providers to include in the Core package:

- `WalletProvider`: Handles all wallet and chain-related states.
- `StateProvider`: Handles all React Query states, including queried data from the chain as well as app-specific states.
- `PhoenixProvider`: Combines the `WalletProvider` and `StateProvider` for easier setup in the Core package.

Refer to the respective provider documentation for detailed instructions on their usage and configurations.