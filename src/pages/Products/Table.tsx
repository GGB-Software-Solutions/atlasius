import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { FormProduct, Product } from "../../types";

const columns: GridColDef<Product>[] = [
  { field: "id", type: "number", hide: true, headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Име на продукт",
    width: 150,
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
    field: "category",
    headerName: "Категория",
    width: 150,
  },
  {
    field: "weight",
    headerName: "Тегло",
    type: "number",
    width: 100,
  },
  {
    field: "company",
    headerName: "Компания",
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.company.name}`,
  },
  // {
  //   field: "quantities",
  //   headerName: "Наличност",
  //   sortable: false,
  //   width: 100,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.productWarehouseQuantities
  //       .map((quantity) => `${quantity.warehouse.name}/${quantity.quantity}`)
  //       .join("\n")}`,
  // },
  //   {
  //     field: "reserved",
  //     headerName: "Запазени",
  //     type: "number",
  //     width: 100,
  //   },
  //   {
  //     field: "readyToDeliver",
  //     headerName: "Готови за изпращане",
  //     type: "number",
  //     width: 100,
  //   },
  //   {
  //     field: "warehouse",
  //     headerName: "Склад",
  //     width: 100,
  //     sortable: false,
  //     valueGetter: (params: GridValueGetterParams) =>
  //       `${params.row.warehouse.name}`,
  //   },
  //   {
];

export const ProductsTable = ({ onRowClick, rows, ...other }) => {
  return (
    <Table
      title={"Продукти"}
      actions={(rowsMap) => {
        return (
          <>
            {onRowClick && (
              <Button
                onClick={() => {
                  onRowClick({
                    row: {},
                  });
                }}
              >
                Добави
              </Button>
            )}
          </>
        );
      }}
      columns={columns}
      onRowClick={onRowClick}
      rows={rows}
      {...other}
    />
  );
};

export default withEditor<FormProduct>(ProductsTable);
