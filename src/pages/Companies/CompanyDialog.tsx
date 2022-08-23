import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import React from "react";
import { EditorProps } from "../../components/Table/withEditor";
import { Company } from "./types";
import CompanyForm from "./CompanyForm";

export default function WarehouseDialog({
  open,
  onClose,
  onSave,
  title,
  data,
}: EditorProps<Company>) {
  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <CompanyForm data={data} onSave={onSave} />
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
