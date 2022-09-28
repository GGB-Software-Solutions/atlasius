import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { MappedOrder } from "../../types";

import { getDeliveryCourier } from "./utils";
import { DeliveryCompany } from "../Companies/types";
import ShippingForm from "./Forms/ShippingForm";
import SpeedyShippingForm from "./Forms/SpeedyShippingForm";
import { useForm } from "react-hook-form";

interface Props {
  orders: MappedOrder[];
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function UpdateOrderDialog({
  orders,
  onClose,
  open,
  onSave,
}: Props) {
  if (!open) return null;
  const order = orders[0];
  const formContext = useForm({ defaultValues: order });

  const handleSave = () => {
    onClose();
    onSave();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xl">
      <DialogTitle>Поръчка({order.id})</DialogTitle>
      <DialogContent>
        {getDeliveryCourier(order) === DeliveryCompany.Econt ? (
          <ShippingForm
            formContext={formContext}
            hideGenerateShippingLabel
            onSave={handleSave}
          />
        ) : (
          <SpeedyShippingForm
            formContext={formContext}
            hideGenerateShippingLabel
            onSave={handleSave}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
      </DialogActions>
    </Dialog>
  );
}
