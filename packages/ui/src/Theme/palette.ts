import { PaletteOptions } from "@mui/material";
import { colors } from "./styleConstants";

const Palette: PaletteOptions = {
  mode: "dark",
  background: {
    default: colors.neutral[900],
    paper: colors.neutral[800],
  },
  primary: {
    main: colors.primary.main,
    light: colors.primary.light,
    dark: colors.primary.dark,
  },
  secondary: {
    main: "#E2571C",
  },
  error: {
    main: colors.error.main,
    light: colors.error.light,
    dark: colors.error.dark,
  },
  warning: {
    main: colors.warning.main,
    light: colors.warning.light,
    dark: colors.warning.dark,
  },
  success: {
    main: colors.success.main,
    light: colors.success.light,
    dark: colors.success.dark,
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[300],
    disabled: colors.neutral[500],
  },
  divider: colors.neutral[700],
};

export default Palette;
