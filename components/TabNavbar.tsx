import {
  AppBar,
  Box,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import useEagerConnect from "../hooks/useEagerConnect";
import theme from "../theme";
import Account from "./Account";
import ElevationScroll from "./ElevationScroll";

interface TabNavbarProps {
  tabs: string[];
  selected: number;
  handleChange: (event: React.SyntheticEvent, newTab: number) => void;
}

export default function TabNavbar({
  tabs,
  selected,
  handleChange,
}: TabNavbarProps) {
  const triedToEagerConnect = useEagerConnect();
  return (
    <ElevationScroll>
      <AppBar position="sticky" color="inherit">
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href="/">
              <a>
                <Grid container justifyContent={"center"}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      padding: ".4rem",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      mr: ".75rem",
                    }}
                  >
                    <img
                      src="images/logo-opt.png"
                      alt="MintSplit"
                      srcSet=""
                      width={"100%"}
                      height={"auto"}
                    />
                  </Box>
                  <Typography fontWeight={700} fontSize={"1.25rem"}>
                    MintSplit
                  </Typography>
                </Grid>
              </a>
            </Link>
            <Account triedToEagerConnect={triedToEagerConnect} />
          </Toolbar>
          <Grid container item xs={12} paddingX={"1.5rem"}>
            <Tabs value={selected} onChange={handleChange}>
              {tabs &&
                tabs.map((text, i) => <Tab key={`tab-${i}`} label={text} />)}
            </Tabs>
          </Grid>
          <Divider sx={{ width: "100%" }} />
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
