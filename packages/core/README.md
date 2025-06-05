# Core Package

The Core package is the central component of the Phoenix Frontend project, built with Next.js 15. It brings together all the necessary packages and provides a unified setup for the application. This package acts as the entry point for the front end, allowing seamless integration of UI components, state management, and utility functions.

## Features

- Built with Next.js 15 for optimal performance and developer experience
- Integrated routing with application directories structure
- Page components for Swap, Pools, Earn, NFT and Help Center features
- Toast notifications and modal system
- Integration with Phoenix contract ecosystem
- Responsive design with proper mobile support

## Installation

To install the Core package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.
4. Run the setup script to build required dependencies:
   ```bash
   ./setup.sh
   ```

## Usage

To use the Core package, follow these steps:

1. Navigate to the project root
2. Run `yarn dev:core` or `yarn dev` to start the development server
3. You can now browse on [http://localhost:3000](http://localhost:3000) to try it out locally!

## Project Structure

- `/app` - Next.js app directory with route components
- `/components` - Reusable UI components specific to the application
- `/context` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions specific to the Core package
- `/providers` - Higher-order components for providing context to the application
- `/public` - Static assets
