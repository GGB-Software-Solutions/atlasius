import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import update from "immutability-helper";

import React from "react";
import { MappedOrder, WarehouseStatus } from "../../types";
import PackingForm from "./Forms/PackingForm";
import { Grid } from "@mui/material";
import CollectedTable from "./CollectedTable";
import UncollectedTable from "./UncollectedTable";
import { getOrderDialogTitle, mapProductsPieces } from "./utils";
import { updateOrderStatus, UpdateOrderStatus } from "./api";
import { CollectProduct } from "../../types/product";

interface Props {
  orders: MappedOrder[];
  open: boolean;
  onClose: () => void;
  setOrders: React.Dispatch<React.SetStateAction<MappedOrder<any>[]>>;
}

export default function OrdersDialog({
  orders,
  onClose,
  open,
  setOrders,
}: Props) {
  if (!open || orders.length === 0) return null;
  const [isLoading, setIsLoading] = React.useState(false);
  const title = getOrderDialogTitle(orders[0]);
  const warehouseStatus = orders[0].warehouseStatus;
  const [collected, setCollected] = React.useState<CollectProduct[]>([]);
  const [uncollected, setUncollected] = React.useState<CollectProduct[]>(
    mapProductsPieces(orders)
  );

  const handleCollect = (
    toCollect: CollectProduct[],
    shouldCollectAll = true
  ) => {
    if (shouldCollectAll) {
      setCollected((prev) => [...prev, ...toCollect]);
      const toCollectKeys = toCollect.map((item) => item.id);
      setUncollected((prev) =>
        prev.filter((item) => !toCollectKeys.includes(item.id))
      );
    } else {
      // Here we are collecting product with scanning so it will always be one product
      const product = toCollect[0];
      const uncollectedProduxIndex = uncollected.findIndex(
        (uncollectedProduct) => uncollectedProduct.id === product.id
      );
      const collectedProductIndex = collected.findIndex(
        (collectedProduct) => collectedProduct.id === product.id
      );

      // If the product is already in the collected items we bump the ordered quantity
      const newCollected =
        collectedProductIndex > -1
          ? update(collected, {
              [collectedProductIndex]: {
                orderedQuantity: { $set: product.orderedQuantity + 1 },
              },
            })
          : update(collected, {
              $push: [
                {
                  ...product,
                  orderedQuantity:
                    product.orderedQuantity === 1
                      ? product.orderedQuantity
                      : product.orderedQuantity - 1,
                },
              ],
            });
      setCollected(newCollected);
      if (product.orderedQuantity === 1) {
        // If the scanned product ordered quantity is 1 we remove it from the uncollected
        setUncollected(
          update(uncollected, { $splice: [[uncollectedProduxIndex, 1]] })
        );
      } else {
        setUncollected(
          update(uncollected, {
            [uncollectedProduxIndex]: {
              orderedQuantity: { $set: product.orderedQuantity - 1 },
            },
          })
        );
      }
    }
  };

  const handleUnCollect = (toUnCollect: CollectProduct[]) => {
    const toUnCollectKeys = toUnCollect.map((item) => item.id);

    let newUncollected = [...uncollected];

    toUnCollect.forEach((product) => {
      const uncollectedProduxIndex = uncollected.findIndex(
        (uncollectedProduct) => uncollectedProduct.id === product.id
      );
      newUncollected =
        uncollectedProduxIndex > -1
          ? update(newUncollected, {
              [uncollectedProduxIndex]: {
                orderedQuantity: { $set: product.orderedQuantity + 1 },
              },
            })
          : update(newUncollected, {
              $push: [product],
            });
    });

    setUncollected(newUncollected);
    setCollected((prev) =>
      prev.filter((item) => !toUnCollectKeys.includes(item.id))
    );
  };

  const handleFinishPicking = async () => {
    setIsLoading(true);

    const orderStatuses = orders.map((order) => ({
      id: order.id,
      warehouseStatus: WarehouseStatus.PACKING,
    }));
    await updateOrderStatus(orderStatuses);

    setOrders((data) =>
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
              </Grid>
              <Grid item xs={12}>
                <CollectedTable
                  onUncollect={handleUnCollect}
                  rows={collected}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <PackingForm
            orders={orders}
            onClose={onClose}
            setOrders={setOrders}
          />
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
