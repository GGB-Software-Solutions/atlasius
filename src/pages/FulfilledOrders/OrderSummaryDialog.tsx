import {
  Box,
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
import ExpeditionsTable from "../Expeditions/Table";

const fetchExpedition = async (orderId: string) => {
  const response = await jsonFetch(
    API_ENDPOINTS.DeliveryDetails + `/${orderId}`
  );
  return response;
};

const renderInfo = (title: string, subtitle: string) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="subtitle2">{title}</Typography>
    <Typography>{subtitle}</Typography>
  </Box>
);

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
          <Grid item xs={3}>
            <Paper elevation={5} sx={{ pl: 2, pr: 2, pb: 2, height: "100%" }}>
              <Typography variant="h6">Информация за клиента</Typography>
              {renderInfo("Име", `${firstName} ${lastName}`)}
              {renderInfo("Email", email)}
              {renderInfo("Телефон", phone)}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={5} sx={{ pl: 2, pr: 2, pb: 2, height: "100%" }}>
              <Typography variant="h6">Адрес за доставка</Typography>
              {renderInfo("Име", `${firstName} ${lastName}`)}
              {renderInfo("Вид доставка", officeName)}
              {renderInfo("Телефон", `${country}/${city}`)}
              {renderInfo("Адрес", address1)}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <ProductsTable rows={products} checkboxSelection={false} />
          </Grid>
          <Grid item xs={12}>
            <ExpeditionsTable
              rows={expedition || []}
              checkboxSelection={false}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
      </DialogActions>
    </Dialog>
  );
}
