import React from "react";
import { DialogActions, Paper, Typography } from "@mui/material";
import ShippingForm from "./ShippingForm";
import OrdersTable from "../Table";
import { GridRowParams } from "@mui/x-data-grid";
import PackingProductsTable from "./PackingProductsTable";
import { getDeliveryCourier } from "../utils";
import SpeedyShippingForm from "./SpeedyShippingForm";
import { DeliveryCompany } from "../../Companies/types";
import {
  FulfillmentStatus,
  MappedOrder,
  OrderStatus,
  WarehouseStatus,
} from "../../../types";
import { LoadingButton } from "@mui/lab";
import { updateOrderStatus, UpdateOrderStatus } from "../api";
import useStore from "../../../store/globalStore";
import {
  getBackgroundColor,
  getHoverBackgroundColor,
} from "../../../utils/common";
import { useForm } from "react-hook-form";
import ExpeditionsTable from "../../Expeditions/Table";
import { ProductResponse } from "../../../types/product";

interface Props {
  orders: MappedOrder[];
  onClose: () => void;
  setOrders: React.Dispatch<React.SetStateAction<MappedOrder<any>[]>>;
}

export default function PackingForm({ orders, onClose, setOrders }: Props) {
  const setNotification = useStore((state) => state.setNotification);
  const [selectedOrder, setSelectedOrder] = React.useState<MappedOrder | null>(
    null
  );
  const [packedProducts, setPackedProducts] = React.useState<ProductResponse[]>(
    []
  );
  const formContext = useForm({ defaultValues: selectedOrder || {} });
  const expedition = formContext.watch("shippingLabel");

  const onRowClick = (params: GridRowParams) => {
    formContext.reset(params.row);
    setSelectedOrder(params.row);
  };

  const handlePack = (data: ProductResponse, pack: boolean) => {
    if (pack) {
      setPackedProducts((prev) => [...prev, data]);
    } else {
      setPackedProducts((prev) =>
        prev.filter((product) => product.id !== data.id)
      );
    }
  };

  const resetSelectedOrder = (orderId: string) => {
    setSelectedOrder(null);
    setPackedProducts([]);
    setOrders((orders) => orders.filter((order) => order.id !== orderId));
  };

  const isAllProductsPacked =
    packedProducts.length === selectedOrder?.products.length;

  const handleReturnForPicking = async () => {
    const orderStatus: UpdateOrderStatus = {
      id: selectedOrder.id,
      warehouseStatus: WarehouseStatus.PICKING,
    };
    const response = await updateOrderStatus(orderStatus);
    if (response.success) {
      setNotification({ type: "success", message: response.success });
      resetSelectedOrder(selectedOrder.id);
    } else {
      setNotification({ type: "error", message: response.error });
    }
  };

  const handleFinishOrder = async (data: MappedOrder) => {
    const orderStatus: UpdateOrderStatus = {
      id: data.id,
      status: OrderStatus.ARCHIVED,
      fulfillmentStatus: FulfillmentStatus.FULFILLED,
      warehouseStatus: WarehouseStatus.SHIPPING,
    };
    await updateOrderStatus(orderStatus);
    resetSelectedOrder(data.id);
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
        getRowClassName={(params) =>
          `row--${
            selectedOrder && selectedOrder.id === params.row.id
              ? "Selected"
              : "NotSelected"
          }`
        }
      />
      {selectedOrder && (
        <Paper sx={{ padding: 2, mt: 4 }} elevation={5}>
          <Typography variant="h4">Поръчка({selectedOrder.id})</Typography>
          <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
            {getDeliveryCourier(selectedOrder) === DeliveryCompany.Econt ? (
              <ShippingForm
                formContext={formContext}
                onSubmit={handleFinishOrder}
              />
            ) : (
              <SpeedyShippingForm
                onSubmit={handleFinishOrder}
                formContext={formContext}
              />
            )}
          </Paper>
          <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
            <PackingProductsTable
              onPack={handlePack}
              rows={selectedOrder.products}
              packedProductsIds={packedProducts.map((product) => product.id)}
            />
          </Paper>
          <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
            <ExpeditionsTable rows={expedition ? [expedition] : []} />
          </Paper>
          <DialogActions>
            <LoadingButton color="primary" onClick={handleReturnForPicking}>
              Върни за събиране
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              disabled={!isAllProductsPacked || !expedition}
              type="submit"
              form="packing-form"
            >
              Приключи поръчка
            </LoadingButton>
          </DialogActions>
        </Paper>
      )}
    </>
  );
}
