import { Box, DialogActions, Paper, Typography } from "@mui/material";
import ShippingForm from "./ShippingForm";
import PackingProductsTable from "./PackingProductsTable";
import {
  getDeliveryCourier,
  mapEcontLabelToExpedition,
  mapProductsPieces,
  mapSpeedyLabelToExpedition,
} from "../utils";
import SpeedyShippingForm from "./SpeedyShippingForm";
import { DeliveryCompany } from "../../Companies/types";
import {
  FulfillmentStatus,
  MappedOrder,
  OrderStatus,
  WarehouseStatus,
} from "../../../types";
import { LoadingButton } from "@mui/lab";
import {
  saveShippingLabel,
  updateOrderStatus,
  UpdateOrderStatus,
} from "../api";
import useStore from "../../../store/globalStore";
import { getDeliveryCompanyCredentials } from "../../../utils/common";
import { ProductResponse } from "../../../types/product";
import { Speedy } from "../../../speedy-api";
import React from "react";
import ExpeditionsTable from "../../Expeditions/Table";
import Econt, { getInnerErrors } from "../../../econt";
import { UseFormReturn } from "react-hook-form";
import { useConfirm } from "material-ui-confirm";

interface Props {
  order: MappedOrder;
  setOrders: React.Dispatch<React.SetStateAction<MappedOrder<any>[]>>;
  setSelectedOrder: React.Dispatch<
    React.SetStateAction<MappedOrder<any> | null>
  >;
  formContext: UseFormReturn<MappedOrder>;
}

export default function PackingOrder({
  order,
  setOrders,
  formContext,
  setSelectedOrder,
}: Props) {
  const setNotification = useStore((state) => state.setNotification);
  const confirm = useConfirm();
  const [packedProducts, setPackedProducts] = React.useState<ProductResponse[]>(
    []
  );
  const expedition = formContext.watch("shippingLabel");
  const orderProducts = mapProductsPieces([order]);

  const isSpeedy = getDeliveryCourier(order) === DeliveryCompany.Speedy;
  const credentials = getDeliveryCompanyCredentials(
    order.company,
    isSpeedy ? DeliveryCompany.Speedy : DeliveryCompany.Econt
  );
  const service = React.useRef(
    isSpeedy ? new Speedy(credentials) : new Econt(credentials)
  ).current;

  const checkForErrors = (response, isSpeedy: boolean) => {
    if (isSpeedy && response.error) {
      setNotification({
        type: "error",
        message: response.error.message,
      });
      return true;
    }
    if (!isSpeedy && response.innerErrors) {
      setNotification({ type: "error", message: getInnerErrors(response) });
      return true;
    }
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

  const handleFinishOrder = async (data: MappedOrder) => {
    const orderStatus: UpdateOrderStatus = {
      id: data.id,
      status: OrderStatus.ARCHIVED,
      fulfillmentStatus: FulfillmentStatus.FULFILLED,
      warehouseStatus: WarehouseStatus.SHIPPING,
    };
    await updateOrderStatus([orderStatus]);
    resetSelectedOrder(data.id);
  };

  const isAllProductsPacked = packedProducts.length === orderProducts.length;

  const handleReturnForPicking = async () => {
    const orderStatus: UpdateOrderStatus = {
      id: order.id,
      warehouseStatus: WarehouseStatus.PICKING,
      status: OrderStatus.NEW,
    };
    const response = await updateOrderStatus([orderStatus]);
    if (response.success) {
      setNotification({ type: "success", message: response.success });
      resetSelectedOrder(order.id);
    } else {
      setNotification({ type: "error", message: response.error });
    }
  };

  const handleGenerateShippingLabel = async () => {
    const order = formContext.getValues();
    const isSpeedy = getDeliveryCourier(order) === DeliveryCompany.Speedy;

    if (order.shippingLabel) {
      await confirm({
        title: "Сигурни ли сте?",
        description: `Вече има генерирана товарителница и преди да продължите се уверете,че е изтрита от ${
          isSpeedy ? "Speedy" : "Еконт"
        }.`,
        confirmationText: "Продължи",
        cancellationText: "Затвори",
      });
    }

    const response = isSpeedy
      ? await (service as Speedy).generateLabel(order)
      : await (service as Econt).generateShippingLabel(order);

    if (checkForErrors(response, isSpeedy)) return;

    const shippingLabel = isSpeedy
      ? mapSpeedyLabelToExpedition(response, order)
      : mapEcontLabelToExpedition(response.label, order);
    const labelResponse = await saveShippingLabel(shippingLabel);

    if (labelResponse && !labelResponse.error) {
      setNotification({
        type: "success",
        message: labelResponse.created,
      });
      formContext.setValue("shippingLabel", shippingLabel);
      const printJS = (await import("print-js")).default;
      if (isSpeedy) {
        const label = await (service as Speedy).printLabel(
          response.parcels[0].id
        );

        printJS({
          printable: label,
          type: "pdf",
          base64: true,
          showModal: true,
        });
      } else {
        printJS({
          printable: response.label.pdfURL,
          type: "pdf",
          showModal: true,
        });
      }
    } else {
      setNotification({ type: "error", message: labelResponse.error });
    }
  };

  const handlePrintLabel = async () => {
    const printJS = (await import("print-js")).default;
    if (isSpeedy) {
      const label = await (service as Speedy).printLabel(
        expedition?.shipmentId
      );

      printJS({
        printable: label,
        type: "pdf",
        base64: true,
        showModal: true,
      });
    } else {
      printJS({
        printable: expedition?.pdfUrl,
        type: "pdf",
        showModal: true,
      });
    }
  };

  return (
    <Paper sx={{ padding: 2, mt: 4 }} elevation={5}>
      <Typography variant="h4">Поръчка({order.id})</Typography>
      <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
        {getDeliveryCourier(order) === DeliveryCompany.Econt ? (
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
          rows={orderProducts}
          packedProductsIds={packedProducts.map((product) => product.id)}
        />
      </Paper>
      <Paper sx={{ padding: 2, mt: 4 }} variant="outlined">
        <ExpeditionsTable
          rows={expedition ? [expedition] : []}
          autoHeight
          checkboxSelection={false}
        />
      </Paper>
      <DialogActions>
        <LoadingButton
          sx={{
            justifyContent: "flex-start",
          }}
          color="primary"
          onClick={handleReturnForPicking}
        >
          Върни за събиране
        </LoadingButton>
        <Box sx={{ flex: 1 }} />
        {expedition && (
          <LoadingButton color="primary" onClick={handlePrintLabel}>
            Принтирай товарителница
          </LoadingButton>
        )}

        <LoadingButton
          color="primary"
          disabled={!credentials}
          onClick={handleGenerateShippingLabel}
        >
          Генерирай товарителница
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
  );
}
