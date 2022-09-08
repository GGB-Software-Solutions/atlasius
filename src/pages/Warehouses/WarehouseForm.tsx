import React from "react";
import { useForm, Controller } from "react-hook-form";
import { css, Grid, TextField } from "@mui/material";
import { Warehouse } from "../../types";

interface Props {
  data: Warehouse;
  onSave: (data: Warehouse) => void;
}

export default function WarehouseForm({ data, onSave }: Props) {
  const { control, handleSubmit } = useForm({
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onSave)} id="myform">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                label="Име на склад"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                type="tel"
                label="Телефон"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="address1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                label="Адрес 1"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="address2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                fullWidth
                label="Адрес 2"
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                label="Пощенски код"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                fullWidth
                label="Държава"
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField {...field} variant="standard" fullWidth label="Град" />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
}
