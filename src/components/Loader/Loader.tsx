import React from "react";
import { CircularProgress, css } from "@mui/material";

const AppLoader = () => {
  return (
    <div
      css={css`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <CircularProgress
        css={css`
          color: "#1a90ff";
          animationduration: "550ms";
        `}
        variant="indeterminate"
        disableShrink
        size={80}
        thickness={4}
      />
    </div>
  );
};

export default AppLoader;
