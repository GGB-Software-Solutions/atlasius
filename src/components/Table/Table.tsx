import React from "react";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import Toolbar from "./Toolbar";
import { Box } from "@mui/material";

type Props = DataGridProps & {
  actions: (rows) => React.ReactNode;
  title: string;
};

export default function Table({ actions, title, ...other }: Props) {
  const toolbar = () => <Toolbar title={title}>{actions}</Toolbar>;
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        {...other}
        components={{
          Toolbar: toolbar,
        }}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
