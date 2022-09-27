import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import React from "react";
import { MappedOrder, WarehouseStatus } from "../../types";
import PackingForm from "./Forms/PackingForm";
import { Grid } from "@mui/material";
import CollectedTable from "./CollectedTable";
import UncollectedTable from "./UncollectedTable";
import { getOrderDialogTitle, mapProductsPieces } from "./utils";
import { updateOrderStatus, UpdateOrderStatus } from "./api";

interface Props {
  orders: MappedOrder[];
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function OrdersDialog({ orders, onClose, open, onSave }: Props) {
  if (!open) return null;
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(orders);
  const title = getOrderDialogTitle(data[0]);
  const warehouseStatus = data[0].warehouseStatus;
  const [collected, setCollected] = React.useState([]);
  const [uncollected, setUncollected] = React.useState(mapProductsPieces(data));

  const handleCollect = (toCollect) => {
    const toCollectKeys = toCollect.map((item) => item.id);
    setCollected((prev) => [...prev, ...toCollect]);
    setUncollected((prev) =>
      prev.filter((item) => !toCollectKeys.includes(item.id))
    );
  };

  const handleUnCollect = (toUnCollect) => {
    const toUnCollectKeys = toUnCollect.map((item) => item.id);
    setUncollected((prev) => [...prev, ...toUnCollect]);
    setCollected((prev) =>
      prev.filter((item) => !toUnCollectKeys.includes(item.id))
    );
  };

  const handleFinishPicking = async () => {
    setIsLoading(true);

    await Promise.all(
      data.map((order) => {
        const orderStatus: UpdateOrderStatus = {
          id: order.id,
          warehouseStatus: WarehouseStatus.PACKING,
        };
        return updateOrderStatus(orderStatus);
      })
    );

    setData((data) =>
      data.map((order) => ({
        ...order,
        warehouseStatus: WarehouseStatus.PACKING,
      }))
    );
    setIsLoading(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xl" fullScreen>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {warehouseStatus === WarehouseStatus.PICKING ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <UncollectedTable
                  onCollect={handleCollect}
                  rows={uncollected}
                />
                <CollectedTable
                  onUncollect={handleUnCollect}
                  rows={collected}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <PackingForm data={data} />
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={onClose}>
          Затвори
        </Button>
        {warehouseStatus === WarehouseStatus.PICKING && (
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleFinishPicking}
            disabled={uncollected.length !== 0}
            loading={isLoading}
          >
            Пакетирай
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
