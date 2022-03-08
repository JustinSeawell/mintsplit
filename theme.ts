import { createTheme } from "@mui/material";

export default createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans"].join(","),
  },
  palette: {
    secondary: {
      light: "#bfa6f0",
      main: "#8e77bd",
      dark: "#5f4b8d",
      contrastText: "#ffffff",
    },
    primary: {
      light: "#3d4755",
      main: "#16202c",
      dark: "#000001",
      contrastText: "#ffffff",
    },
  },
});
