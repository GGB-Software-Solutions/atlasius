import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import useStore from "../../store/globalStore";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, children }: Props) {
  const selectedCompany = useStore((state) => state.selectedCompany);
  const pageTitle = `${title}${
    selectedCompany ? "/" + selectedCompany.name : ""
  }`;
  return (
    <>
      <Paper
        square
        sx={{
          bgcolor: "divider",
          p: 1,
          borderBottomColor: "divider",
        }}
      >
        <Typography variant="subtitle1">{pageTitle}</Typography>
      </Paper>
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
    </>
  );
}
