import type { StorybookConfig } from "@storybook/react-webpack5";
import { join, dirname } from "path";
import * as path from 'path';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport",
  ],
  // Simplify TypeScript options
  typescript: {
    check: false,
    reactDocgen: false, // Disable docgen to avoid processing issues
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: false,
      }
    },
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  // Use external webpack config
  webpackFinal: async (config) => {
    const customWebpackConfig = require('./webpack.config');
    return customWebpackConfig({ config });
  },
  core: {
    disableTelemetry: true,
    // Ensure csf-plugin doesn't interfere with processing
    disableWhatsNewNotifications: true,
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
