import theme from "../Theme";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from "@mui/material";

const PhoenixThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {children}
    </ThemeProvider>
  );
};

export default PhoenixThemeProvider;