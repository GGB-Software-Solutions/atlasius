import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { Product } from "../../types";

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
  //   {
  //     field: "quantity",
  //     headerName: "Обща бройка",
  //     type: "number",
  //     width: 100,
  //   },
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
  //     field: "company",
  //     headerName: "Компания",
  //     width: 100,
  //     sortable: false,
  //     valueGetter: (params: GridValueGetterParams) =>
  //       `${params.row.company.name}`,
  //   },
];

const ProductsTable = ({ onRowClick, rows }) => {
  return (
    <Table
      title="Продукти"
      actions={() => (
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
      rows={rows}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default withEditor(ProductsTable);
