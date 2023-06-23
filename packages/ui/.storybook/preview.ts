import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "../src";
import theme from "../src/Theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  withThemeFromJSXProvider({
  themes: {
    dark: theme,
  },
  defaultTheme: 'dark',
  Provider: ThemeProvider,
  GlobalStyles: CssBaseline,
})];

export default preview;
