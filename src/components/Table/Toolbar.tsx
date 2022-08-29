import React from "react";
import {
  GridRowId,
  GridToolbarContainer,
  GridToolbarExport,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";

interface Props<T> {
  title?: string;
  children?: (rows: Map<GridRowId, T>) => React.ReactNode;
}

export default function Toolbar<T>({ title, children }: Props<T>) {
  const apiRef = useGridApiContext();
  const selectedRows = apiRef?.current?.getSelectedRows();

  return (
    <GridToolbarContainer
      sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
    >
      {title && (
        <Typography variant="h6" sx={{ mx: 2 }}>
          {title}
        </Typography>
      )}
      {children && <Divider orientation="vertical" flexItem />}
      {children && children(selectedRows)}
      <Box sx={{ marginLeft: "auto" }}>
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
}
