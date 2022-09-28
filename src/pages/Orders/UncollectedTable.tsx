import * as React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import { CollectProduct } from "../../types/product";

const columns: GridColDef<CollectProduct>[] = [
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
    field: "orderedQuantity",
    headerName: "Бройка",
    type: "number",
    width: 100,
  },
];

interface Props {
  onCollect: (products: CollectProduct[]) => void;
  rows: CollectProduct[];
}

export const UncollectedTable = ({ onCollect, rows }: Props) => {
  return (
    <Table
      title={"Стока за събиране"}
      actions={(rowsMap) => {
        return (
          <>
            {onCollect && (
              <Button
                disabled={rowsMap.size === 0}
                onClick={() => {
                  onCollect(Array.from(rowsMap.values()));
                }}
              >
                Събери
              </Button>
            )}
          </>
        );
      }}
      rows={rows}
      columns={columns}
    />
  );
};

export default UncollectedTable;
