import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import React from "react";
import { Order } from "../../types";
import { ProductsTable } from "../Products/Table";
import { EditorProps } from "../../components/Table/withEditor";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";

const fetchExpedition = async (orderId: string) => {
  const response = await jsonFetch(API_ENDPOINTS.DeliveryDetails, {
    method: "GET",
  });
  return response;
};

export default function OrderSummaryDialog({
  data,
  onClose,
  open,
}: EditorProps<Order>) {
  if (!open) return null;
  const [expedition, setExpedition] = React.useState();
  const order = data;
  const {
    firstName,
    lastName,
    phone,
    email,
    officeName,
    country,
    city,
    address1,
    products,
    id,
  } = order || {};

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xl"
      TransitionProps={{
        async onEnter() {
          const expedition = await fetchExpedition(id);
          setExpedition(expedition);
        },
      }}
    >
      <DialogTitle>Поръчка({order.id})</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ProductsTable rows={products} />
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Typography>Информация за клиента</Typography>
              <Typography>
                {firstName}/{lastName}
              </Typography>
              <Typography>{email}</Typography>
              <Typography>{phone}</Typography>
            </Paper>
            <Paper>
              <Typography>Адрес за доставка</Typography>
              <Typography>
                {firstName}/{lastName}
              </Typography>
              <Typography>{officeName}</Typography>
              <Typography>
                {country}/{city}
              </Typography>
              <Typography>{address1}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>Експедиция</Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
      </DialogActions>
    </Dialog>
  );
}
