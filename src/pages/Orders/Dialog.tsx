import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { MappedOrder } from "../../types";
import Form from "./Form";

interface Props {
  orders: MappedOrder[];
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function CollectGoodsDialog({
  orders,
  onClose,
  open,
  onSave,
}: Props) {
  return (
    <Dialog open={open} fullWidth maxWidth="xl" fullScreen>
      <DialogTitle>{"Събери стока"}</DialogTitle>
      <DialogContent>
        <Form onSave={onSave} data={orders} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
        {/* TODO: Change status to pick/pack/ship etc. */}
        <Button variant="contained" type="submit" color="primary" form="myform">
          Пакетирай
        </Button>
      </DialogActions>
    </Dialog>
  );
}
