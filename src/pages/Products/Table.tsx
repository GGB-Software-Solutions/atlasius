import * as React from "react";
import {
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { FormProduct } from "../../types/product";
import useStore from "../../store/globalStore";
import { Warehouse } from "../../types";

const columns = (warehouses: Warehouse[]): GridColDef<FormProduct>[] => [
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
    width: 150,
    headerName: "Компания",
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.company.name}`,
  },
  {
    field: "productWarehouseQuantities",
    headerName: "Наличност",
    sortable: false,
    width: 400,
    valueGetter: (
      params: GridValueGetterParams<string, FormProduct>
    ): string => {
      return `${params.row.productWarehouseQuantities
        .map((quantity) => {
          const warehouse = warehouses.find(
            (warehouse) => warehouse.id.toString() === quantity.warehouseId
          );
          return `${warehouse?.name}/${quantity.quantity}`;
        })
        .join("\n")}`;
    },
  },
  {
    field: "productWarehouseQuantities1",
    headerName: "Резервирани",
    sortable: false,
    width: 400,
    valueGetter: (params: GridValueGetterParams<string, FormProduct>) => {
      return `${params.row.productWarehouseQuantities
        .map((quantity) => {
          const warehouse = warehouses.find(
            (warehouse) => warehouse.id.toString() === quantity.warehouseId
          );
          return `${warehouse?.name}/${quantity.reserved}`;
        })
        .join("\n")}`;
    },
  },
];

interface Props {
  onRowClick: (params: Partial<GridRowParams>) => void;
  rows: FormProduct[];
}

export const ProductsTable = ({ onRowClick, rows, ...other }: Props) => {
  const selectedCompany = useStore((state) => state.selectedCompany);
  const warehouses = useStore((state) => state.warehouses);

  return (
    <Table
      title={"Продукти"}
      getRowId={(row) => row.id}
      actions={() => {
        return (
          <>
            {onRowClick && (
              <Button
                onClick={() => {
                  onRowClick({
                    row: {
                      company: selectedCompany,
                    },
                  });
                }}
              >
                Добави
              </Button>
            )}
          </>
        );
      }}
      columns={columns(warehouses)}
      onRowClick={onRowClick}
      rows={rows}
      {...other}
    />
  );
};

export default withEditor<FormProduct>(ProductsTable);
