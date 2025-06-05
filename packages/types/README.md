# Types Package

The `Types` package contains TypeScript type definitions used throughout the Phoenix Frontend ecosystem. It provides a centralized location for shared types, interfaces, and type utilities that ensure type consistency across all packages.

## Features

- Shared TypeScript types and interfaces
- Integration with Material UI component types
- Stellar SDK type definitions
- Type utilities for common patterns

## Installation

To install the Types package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.

## Usage

To use the Types package in your application:

```typescript
import { SomeType, SomeInterface } from "@phoenix-protocol/types";

// Use the imported types in your code
const someVariable: SomeType = {
  // properties according to SomeType
};
```

## Development

To work on the Types package:

1. Make changes to the files in the `src` directory
2. Run `yarn build` or `yarn dev` to build the package
3. Test your changes by importing the package in other parts of the Phoenix Frontend

This package is a dependency for most other packages in the Phoenix Frontend ecosystem, so changes should be made carefully to avoid breaking existing functionality.
