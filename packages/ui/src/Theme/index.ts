import { 
  ThemeOptions, 
  createTheme 
} from '@mui/material/styles';
import palette from './palette';
import typography from './typography';

const themeOptions: ThemeOptions = {
  palette: palette,
  typography: typography,
}

const theme = createTheme(themeOptions);

export default theme;