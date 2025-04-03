import { colors as styleColors } from './styleConstants';

// Legacy colors object that maps to our new styleConstants
// This helps maintain backward compatibility while moving to the new system
const Colors = {
  primary: styleColors.primary.gradient,
  secondary: styleColors.primary.main,
  third: "#E2571C",
  background: styleColors.gradients.card,
  backgroundLight: "#FFFFFF",
  backgroundSidenav: "linear-gradient(180deg, #1A1C20 0%, #0E1011 100%)",
  stroke: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
  text: styleColors.neutral[50],
  success: styleColors.success.main,
  warning: styleColors.warning.main,
  info: "#247CFF",
  error: styleColors.error.main,
  inputsHover: styleColors.neutral[800],
};

export default Colors;
