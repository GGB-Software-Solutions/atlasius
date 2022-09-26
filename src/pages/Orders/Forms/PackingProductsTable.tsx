import * as React from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Table from "../../../components/Table";
import { darken, lighten } from "@mui/material/styles";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const renderPackButton =
  (onClick, packedProductsIds) => (params: GridRenderCellParams) => {
    const isPacked = packedProductsIds.includes(params.row.id);
    const handleClick = () => onClick(params.row, !isPacked);
    return (
      <strong>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClick}
        >
          {isPacked ? "Върни за пакетиране" : "Пакетирай"}
        </Button>
      </strong>
    );
  };

const columns = (onPack, packedProductsIds): GridColDef[] => [
  { field: "id", type: "number", hide: true, headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Име на продукт",
    width: 350,
  },
  {
    field: "sku",
    headerName: "SKU",
    width: 150,
  },
  {
    field: "ean",
    headerName: "Баркод",
    width: 150,
  },
  {
    field: "pieces",
    headerName: "Бройка",
    width: 150,
  },
  {
    field: "",
    headerName: "Пакетирай",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: renderPackButton(onPack, packedProductsIds),
  },
];

//TODO: Create econt label when products are packed and the address is valid
export const PackingProductsTable = ({
  rows,
  onPack,
  packedProductsIds,
  ...other
}) => {
  return (
    <Box
      sx={{
        "& .row--Packed": {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.info.main, theme.palette.mode),
          "&:hover": {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode
              ),
          },
        },
      }}
    >
      <Table
        checkboxSelection={false}
        title={"Продукти за пакетиране"}
        columns={columns(onPack, packedProductsIds)}
        rows={rows}
        getRowClassName={(params) =>
          `row--${
            packedProductsIds.includes(params.row.id) ? "Packed" : "NotPacked"
          }`
        }
        {...other}
      />
    </Box>
  );
};

export default PackingProductsTable;
