<p align="center">
  <img src="https://i.epvpimg.com/Rx1ddab.png" />
</p>

# Phoenix Frontend

The Phoenix Frontend is a TypeScript-based application that utilizes yarn workspaces to manage multiple packages. It consists of several packages located in the `/packages` directory. Each package has a specific purpose and contributes to the overall functionality of the application.

## Packages

### [UI](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/ui)

The `UI` package is a UI kit based on Material-UI (MUI). It provides a set of reusable components and styles that follow the Material Design guidelines. These components can be used across the application to create a consistent and visually appealing user interface.

### [State](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/state)

The `State` package is responsible for managing all the application's states. It includes zustand along with its associated actions. This package ensures that the application's data is efficiently managed and updated in response to user interactions or external events.

### [Utils](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/utils)

The `Utils` package contains various utility and helper functions that are used throughout the application. These functions are designed to perform common tasks, such as data manipulation, date formatting, string operations, or network requests. The `Utils` package provides a centralized location for these functions, promoting code reusability and maintainability.

### [Core](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/core)

The `Core` package serves as the central package that brings all the other packages together. It acts as the main entry point of the application, coordinating the initialization and integration of the UI, state management, and utility functions. The `Core` package establishes the foundation for the application's architecture and provides the necessary interfaces for interaction between different parts of the system.

### [Demo](https://github.com/Phoenix-Protocol-Group/phoenix-frontend/tree/main/packages/demo)

The `Demo` package is just a playground for internal demos and to play around with the soroban sdk. Only used for internal tests and unstable.

## Getting Started

To get started with the Phoenix Frontend, follow these steps:

1. Clone the repository to your local machine.
2. Ensure that you have Node.js and yarn installed.
3. Navigate to the root directory of the project.
4. Run `yarn install` to install the project dependencies.
5. Navigate to the desired package (e.g., `UI`, `State`, `Utils`, or `Core`) within the `/packages` directory.
6. Follow the instructions provided in the package's readme file to set up and use that specific package.


## Contact

If you have any questions, suggestions, or feedback regarding the Phoenix Frontend, please contact our development team. We appreciate your interest and look forward to hearing from you!
