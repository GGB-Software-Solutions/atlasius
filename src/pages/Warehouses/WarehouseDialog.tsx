import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { EditorProps } from "../../components/Table/withEditor";
import { Warehouse } from "./types";
import WarehouseForm from "./WarehouseForm";

export default function WarehouseDialog({
  open,
  onClose,
  onSave,
  title,
  data,
}: EditorProps<Warehouse>) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <WarehouseForm data={data} onSave={onSave} />
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
