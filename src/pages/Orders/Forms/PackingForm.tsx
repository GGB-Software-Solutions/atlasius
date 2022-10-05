import React from "react";
import OrdersTable from "../Table";
import { GridRowParams } from "@mui/x-data-grid";
import { MappedOrder } from "../../../types";
import {
  getBackgroundColor,
  getHoverBackgroundColor,
} from "../../../utils/common";
import { useForm } from "react-hook-form";
import PackingOrder from "./PackingOrder";

interface Props {
  orders: MappedOrder[];
  setOrders: React.Dispatch<React.SetStateAction<MappedOrder<any>[]>>;
}

export default function PackingForm({ orders, setOrders }: Props) {
  const [selectedOrder, setSelectedOrder] = React.useState<MappedOrder | null>(
    null
  );

  const formContext = useForm({ defaultValues: selectedOrder || {} });

  const onRowClick = (params: GridRowParams) => {
    formContext.reset(params.row);
    setSelectedOrder(params.row);
  };

  return (
    <>
      <OrdersTable
        sx={{
          "& .row--Selected": {
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
        rows={orders}
        checkboxSelection={false}
        onRowClick={onRowClick}
        autoHeight
        getRowClassName={(params) =>
          `row--${
            selectedOrder && selectedOrder.id === params.row.id
              ? "Selected"
              : "NotSelected"
          }`
        }
      />
      {selectedOrder && (
        <PackingOrder
          setSelectedOrder={setSelectedOrder}
          setOrders={setOrders}
          order={selectedOrder}
          formContext={formContext}
        />
      )}
    </>
  );
}
