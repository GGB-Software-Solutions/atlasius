import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { EditorProps } from "../../components/Table/withEditor";
import Form, { FormData } from "./Form";

export default function DeliveredProductsSubmitDialog({
  open,
  onClose,
  onSave,
  title,
}: Omit<EditorProps<FormData>, "data">) {
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Form onSave={onSave} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
        <Button variant="contained" type="submit" color="primary" form="myform">
          Заприходи
        </Button>
      </DialogActions>
    </Dialog>
  );
}
