import React from "react";
import {
  DataGrid,
  DataGridProps,
  GridRowId,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Toolbar from "./Toolbar";
import { Box } from "@mui/material";

export interface Props<T extends GridValidRowModel> extends DataGridProps<T> {
  actions?: (rows: Map<GridRowId, T>) => React.ReactNode;
  title?: string;
  rows: T[];
}

export default function Table<T extends GridValidRowModel>({
  actions,
  title,
  rows,
  checkboxSelection = true,
  ...other
}: Props<T>) {
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
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        rows={rows}
      />
    </Box>
  );
}
