import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { css } from "@emotion/react";
import Login from "../../src/components/Login";

const Home: NextPage = () => {
  return (
    <Container
      css={css`
        width: 100vw;
        height: 100vh;
        background-image: url(https://media.istockphoto.com/vectors/space-horizontal-background-with-rocket-planets-cosmonaut-and-copy-vector-id1307902470?k=20&m=1307902470&s=170667a&w=0&h=VvREuls2z7dEYrMkKOeclqbV0L08xq778JFZMjukcZU=);
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0;
      `}
      maxWidth="lg"
    >
      <Login />
    </Container>
  );
};

export default Home;
