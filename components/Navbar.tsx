import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import useEagerConnect from "../hooks/useEagerConnect";
import Account from "./Account";

const Nav = styled("nav")({
  display: "flex",
  justifyContent: "space-between",
  padding: "1.5rem",
});

export default function Navbar() {
  const triedToEagerConnect = useEagerConnect();
  return (
    <Nav>
      <Link href="/">
        <a>
          <Typography fontWeight={900}>MintSplit</Typography>
        </a>
      </Link>
      <Account triedToEagerConnect={triedToEagerConnect} />
    </Nav>
  );
}
