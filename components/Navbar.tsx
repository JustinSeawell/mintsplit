import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import useEagerConnect from "../hooks/useEagerConnect";
import theme from "../theme";
import Account from "./Account";
import ElevationScroll from "./ElevationScroll";

export default function Navbar() {
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
            {/* <Account triedToEagerConnect={triedToEagerConnect} /> */}
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
