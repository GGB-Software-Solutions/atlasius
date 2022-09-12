import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import { css } from "@emotion/react";
import Login from "../../src/components/Login";

const Home: NextPage = () => {
  return (
    <Container
      disableGutters
      css={css`
        width: 100vw;
        height: 100vh;
        background-color: lightblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0;
      `}
    >
      <Login />
    </Container>
  );
};

Home.whitelist = true;

export default Home;
