import { styled } from "@mui/material/styles";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Main = styled("main")({
  minHeight: "calc(100vh - 64px - 100px);", // TODO: Perfect this
  textAlign: "center",
});

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
