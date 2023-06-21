import { 
  ThemeOptions, 
  createTheme 
} from '@mui/material/styles';
import Palette from './palette';
import Typography from './typography';

const themeOptions: ThemeOptions = {
  palette: Palette,
  typography: Typography,
}

const theme = createTheme(themeOptions);

export default theme;