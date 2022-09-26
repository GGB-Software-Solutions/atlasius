import React from "react";
import { Paper } from "@mui/material";
import ShippingForm from "./ShippingForm";
import OrdersTable from "../Table";
import { GridRowParams } from "@mui/x-data-grid";
import PackingProductsTable from "./PackingProductsTable";
import { getDeliveryCourier, mapProductsPieces } from "../utils";
import SpeedyShippingForm from "./SpeedyShippingForm";
import { DeliveryCompany } from "../../Companies/types";
import { Order } from "../../../types";

interface Props {
  data: Order[];
}

export default function PackingForm({ data }: Props) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order>(null);
  const [packedProducts, setPackedProducts] = React.useState([]);

  const onRowClick = (params: GridRowParams) => {
    setSelectedOrder(params.row);
  };

  const handlePack = (data, pack: boolean) => {
    if (pack) {
      setPackedProducts((prev) => [...prev, data]);
    } else {
      setPackedProducts((prev) =>
        prev.filter((product) => product.id !== data.id)
      );
    }
  };

  return (
    <>
      <OrdersTable rows={data} onRowClick={onRowClick} />
      {selectedOrder && (
        <>
          <Paper sx={{ padding: 2, mt: 4 }} variant="outlined" elevation={5}>
            {getDeliveryCourier(selectedOrder) === DeliveryCompany.Econt ? (
              <ShippingForm data={selectedOrder} />
            ) : (
              <SpeedyShippingForm data={selectedOrder} />
            )}
          </Paper>
          <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
            <PackingProductsTable
              onPack={handlePack}
              rows={mapProductsPieces([selectedOrder])}
              packedProductsIds={packedProducts.map((product) => product.id)}
            />
          </Paper>
        </>
      )}
    </>
  );
}
