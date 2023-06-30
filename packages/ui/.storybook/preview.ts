import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "../src";
import theme from "../src/Theme";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

const customViewports = {
  iPhone12: {
    name: "iPhone 12",
    styles: {
      width: "390px",
      height: "844px",
    },
  },
  iPhone12Pro: {
    name: "iPhone 12 Pro",
    styles: {
      width: "390px",
      height: "844px",
    },
  },
  iPhone12ProMax: {
    name: "iPhone 12 Pro Max",
    styles: {
      width: "428px",
      height: "926px",
    },
  },
  iPhone12Mini: {
    name: "iPhone 12 Mini",
    styles: {
      width: "360px",
      height: "780px",
    },
  },
  kindleFireHD: {
    name: "Kindle Fire HD",
    styles: {
      width: "533px",
      height: "801px",
    },
  },
  desktopFullHd: {
    name: "Desktop Full HD",
    styles: {
      width: "1920px",
      height: "1080px",
    },
  },
  desktop4k: {
    name: "Desktop 4K",
    styles: {
      width: "3840px",
      height: "2160px",
    },
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...customViewports,
      },
    },
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
    defaultTheme: "dark",
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
];

export default preview;
