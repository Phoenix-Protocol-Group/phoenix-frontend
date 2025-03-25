import { 
  ThemeOptions, 
  createTheme 
} from '@mui/material/styles';
import Palette from './palette';
import Typography from './typography';
import { borderRadius, spacing } from './styleConstants';

// Create a more comprehensive theme with consistent design tokens
const themeOptions: ThemeOptions = {
  palette: Palette,
  typography: Typography,
  shape: {
    borderRadius: parseInt(borderRadius.md.replace('rem', '')) * 16, // Convert from rem to px
  },
  spacing: (factor: number) => {
    const spacingValues = {
      0: '0',
      1: spacing.xs,
      2: spacing.sm,
      3: spacing.md,
      4: spacing.lg,
      5: spacing.xl,
      6: spacing.xxl,
    };
    
    // @ts-ignore - Handle the mapping of number factors to spacing values
    return spacingValues[factor] || `${0.25 * factor}rem`;
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
}

const theme = createTheme(themeOptions);

export default theme;
