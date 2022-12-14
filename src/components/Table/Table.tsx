import React from "react";
import {
  DataGrid,
  DataGridProps,
  GridRowId,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Toolbar from "./Toolbar";
import { Box } from "@mui/material";
import commonColumns from "./commonColumns";

export interface Props<T extends GridValidRowModel> extends DataGridProps<T> {
  actions?: (rows: Map<GridRowId, T>) => React.ReactNode;
  title?: string;
  rows: T[];
  extendWithCommonColumns?: boolean;
}

export default function Table<T extends GridValidRowModel>({
  actions,
  title,
  rows,
  checkboxSelection = true,
  extendWithCommonColumns = true,
  ...other
}: Props<T>) {
  const toolbar = () => <Toolbar title={title}>{actions}</Toolbar>;
  return (
    <Box sx={{ width: "100%", flexGrow: 1 }}>
      <DataGrid
        {...other}
        columns={[
          ...other.columns,
          ...(extendWithCommonColumns ? commonColumns : []),
        ]}
        components={{
          Toolbar: toolbar,
        }}
        pagination
        initialState={{
          ...other.initialState,
          pagination: {
            pageSize: 25,
          },
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        rows={rows}
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            textOverflow: "clip",
            whiteSpace: "break-spaces",
            lineHeight: 1,
          },
          ...other.sx,
        }}
      />
    </Box>
  );
}
