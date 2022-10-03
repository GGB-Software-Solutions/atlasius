import React from "react";
import {
  DataGrid,
  DataGridProps,
  GridRowId,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Toolbar from "./Toolbar";
import { Box } from "@mui/material";
import useStore from "../../store/globalStore";
import commonColumns from "./commonColumns";

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
  const selectedCompany = useStore((state) => state.selectedCompany);
  const initialCompanyFilter = selectedCompany
    ? [
        {
          columnField: "company",
          operatorValue: "equals",
          value: selectedCompany.name,
        },
      ]
    : [];
  const toolbar = () => <Toolbar title={title}>{actions}</Toolbar>;
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        {...other}
        columns={[...other.columns, ...commonColumns]}
        components={{
          Toolbar: toolbar,
        }}
        filterModel={{
          items: initialCompanyFilter,
        }}
        pagination
        autoHeight
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
