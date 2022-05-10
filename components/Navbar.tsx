import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import useEagerConnect from "../hooks/useEagerConnect";
import Account from "./Account";
import ElevationScroll from "./ElevationScroll";

export default function Navbar() {
  const triedToEagerConnect = useEagerConnect();
  return (
    <ElevationScroll>
      <AppBar position="sticky" color="inherit">
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link href="/">
              <a>
                <Typography fontWeight={700} fontSize={"1.25rem"}>
                  MintSplit
                </Typography>
              </a>
            </Link>
            <Account triedToEagerConnect={triedToEagerConnect} />
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
