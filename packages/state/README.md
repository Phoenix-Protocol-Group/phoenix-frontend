# State Package

The State package is a collection of state management utilities for the Phoenix Frontend project. It utilizes Zustand, a powerful library for managing application state with a simple yet flexible API.

## Features

- Zustand-based state management
- Action creators for state manipulation
- Type-safe state implementation with TypeScript
- Optimized for performance with minimal re-renders
- Integration with Phoenix contracts

## Installation

To install the State package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.

## Usage

To use the State package in your application, follow these steps:

1. Import the desired stores from the State package:

   ```typescript
   import { useAppStore, useWalletStore } from "@phoenix-protocol/state";
   ```

2. Use the store hooks in your components:

   ```typescript
   function MyComponent() {
     const { someState, someAction } = useAppStore();
     // Use the state and actions as needed
     return <div>{someState}</div>;
   }
   ```

3. For more complex state management, you can create custom hooks that combine multiple stores:
   ```typescript
   function useCustomState() {
     const appState = useAppStore();
     const walletState = useWalletStore();

     // Combine state as needed
     return {
       ...appState,
       wallet: walletState,
     };
   }
   ```

## Development

To develop or extend the State package:

1. Make changes to the files in the `src/state` directory
2. Run `yarn build:state` or `yarn dev` from the project root to build the package
3. Import and use your changes in other packages

The package is structured to make it easy to add new stores and actions while maintaining type safety and performance.
