import { Box } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Props) {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        flex: 1,
      }}
    >
      {children}
    </Box>
  );
}
