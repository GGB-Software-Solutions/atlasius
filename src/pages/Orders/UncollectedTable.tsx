import * as React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import update from "immutability-helper";

import Table from "../../components/Table";
import { CollectProduct } from "../../types/product";
import useStore from "../../store/globalStore";
import BarcodeInput from "../../components/BarcodeInput";

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
  onCollect: (products: CollectProduct[], shouldCollectAll?: boolean) => void;
  rows: CollectProduct[];
}

export const UncollectedTable = ({ onCollect, rows }: Props) => {
  const setNotification = useStore((state) => state.setNotification);

  const handleScan = (barcode: string) => {
    const product = rows.find((row) => row.ean === barcode);
    if (product) {
      onCollect([product], false);
      setNotification({
        type: "success",
        message: `Продукт с баркод:${barcode} е събран`,
      });
    } else {
      setNotification({
        type: "error",
        message: `Не е намерен продукт с баркод:${barcode}`,
      });
    }
  };

  return (
    <>
      <BarcodeInput onScan={handleScan} />
      <Table
        extendWithCommonColumns={false}
        title={"Стока за събиране"}
        actions={(rowsMap) => {
          return (
            <>
              {onCollect && (
                <Button
                  disabled={rowsMap.size === 0}
                  onClick={() => {
                    onCollect(Array.from(rowsMap.values()), true);
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
        autoHeight
      />
    </>
  );
};

export default UncollectedTable;
