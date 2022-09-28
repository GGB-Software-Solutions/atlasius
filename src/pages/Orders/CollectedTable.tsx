import * as React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import { ProductResponse } from "../../types/product";

const columns: GridColDef<ProductResponse>[] = [
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
];

interface Props {
  onUncollect: (products: ProductResponse[]) => void;
  rows: ProductResponse[];
}

export const CollectedTable = ({ onUncollect, rows }: Props) => {
  return (
    <Table
      title="Събрана стока"
      actions={(rowsMap) => {
        return (
          <>
            {onUncollect && (
              <Button
                disabled={rowsMap.size === 0}
                onClick={() => {
                  onUncollect(Array.from(rowsMap.values()));
                }}
              >
                Върни за събиране
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

export default CollectedTable;
