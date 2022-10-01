import { GridColDef } from "@mui/x-data-grid";

const commonColumns: GridColDef[] = [
  {
    field: "createdAt",
    width: 150,
    headerName: "Дата на създаване",
    type: "dateTime",
    valueGetter: ({ value }) => value && new Date(value),
  },
  {
    field: "createdBy",
    width: 150,
    headerName: "Създаден от",
    valueGetter: ({ value }) => value && `${value.firstName} ${value.lastName}`,
  },
  {
    field: "updatedAt",
    width: 150,
    headerName: "Дата на актуализиране",
    type: "dateTime",
    valueGetter: ({ value }) => value && new Date(value),
  },
  {
    field: "updatedBy",
    width: 150,
    headerName: "Актуализиран от",
    valueGetter: ({ value }) => value && `${value.firstName} ${value.lastName}`,
  },
];

export default commonColumns;
