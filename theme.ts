import { createTheme } from "@mui/material";

export default createTheme({
  typography: {
    fontFamily: ["Inter Variable"].join(","),
  },
  palette: {
    secondary: {
      light: "#46444c",
      main: "#1f1d24",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    primary: {
      light: "#d9b5ff",
      main: "#a585ff",
      dark: "#7257cb",
      contrastText: "#ffffff",
    },
  },
});
