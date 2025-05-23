# UI Package

The UI package is a collection of reusable components and styles based on Material-UI (MUI) v6. It provides a comprehensive set of UI elements that follow the Material Design guidelines, enabling developers to create visually appealing and consistent user interfaces for the Phoenix Protocol application.

## Features

- Built on Material UI v6 with Next.js 15 integration
- Responsive components for both desktop and mobile views
- Custom theme with dark mode support
- Animation support via Framer Motion
- Storybook integration for component development and documentation
- Type-safe component props using TypeScript

## Installation

To install the UI package, follow these steps:

1. Ensure that you have Node.js and yarn installed on your machine.
2. Navigate to the root directory of the Phoenix Frontend project.
3. Run `yarn install` to install all project dependencies.

## Usage

To use the UI package in your application, follow these steps:

1. Import the desired components from the UI package into your project:

   ```typescript
   import { Button, Card, TextField } from "@phoenix-protocol/ui";
   ```

2. Utilize the imported components within your application's codebase:

   ```typescript
   function MyComponent() {
     return (
       <Card>
         <TextField label="Input" />
         <Button variant="contained">Submit</Button>
       </Card>
     );
   }
   ```

3. Customize the components as needed, utilizing the available props and styling options.

## Storybook

The UI package includes a Storybook setup, which provides a development environment for designing, documenting, and testing the UI components. To launch the Storybook, run the following command from the project root:

```bash
yarn storybook
```

This will start the Storybook server, and you can access it in your browser at [http://localhost:6006](http://localhost:6006).

## Customization

The UI package provides various options for customization. You can modify the appearance and behavior of the components by adjusting the props, applying custom styles, or extending the existing components to create new ones. Refer to the component's documentation in Storybook and Material-UI's guidelines for detailed instructions on customization.

## Development

To develop or extend the UI package:

1. Make changes to the files in the `src` directory
2. Run `yarn build:ui` or `yarn dev` from the project root to build the package
3. View your changes in Storybook with `yarn storybook`
