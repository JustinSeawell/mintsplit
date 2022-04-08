import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import useEagerConnect from "../hooks/useEagerConnect";
import Account from "./Account";

interface ElevationScrollProps {
  children: React.ReactElement;
}

function ElevationScroll({ children }: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Navbar() {
  const triedToEagerConnect = useEagerConnect();
  return (
    <>
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
      {/* TODO: What is this extra toolbar? */}
      {/* <Toolbar /> */}
    </>
  );
}
