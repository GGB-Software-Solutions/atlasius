import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { EditorProps } from "../../components/Table/withEditor";
import { Product } from "../../types";
import ProductForm from "./Form";

export default function ProductDialog({
  open,
  onClose,
  onSave,
  title,
  data,
}: EditorProps<Product>) {
  const isNew = !Boolean(data.id);
  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle>{isNew ? "Нов продукт" : `Продукт(${data.id})`}</DialogTitle>
      <DialogContent>
        <ProductForm data={data} onSave={onSave} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
        <Button variant="contained" type="submit" color="primary" form="myform">
          Добави
        </Button>
      </DialogActions>
    </Dialog>
  );
}
