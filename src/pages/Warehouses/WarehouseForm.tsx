import React from "react";
import { useForm, Controller } from "react-hook-form";
import { css, TextField } from "@mui/material";
import { Warehouse } from "./types";

interface Props {
  data: Warehouse;
  onSave: (data: Warehouse) => void;
}

export default function WarehouseForm({ data, onSave }: Props) {
  const { control, handleSubmit } = useForm({
    defaultValues: data,
  });

  return (
    <form
      css={css`
        display: flex;
        flex-direction: column;
        gap: 15px;
      `}
      onSubmit={handleSubmit(onSave)}
      id="myform"
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Име на склад" />
        )}
      />
      <Controller
        name="address1"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Адрес 1" />
        )}
      />
      <Controller
        name="address2"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Адрес 2" />
        )}
      />
      <Controller
        name="zipCode"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Пощенски код" />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Град" />
        )}
      />
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" label="Държава" />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField {...field} variant="standard" type="tel" label="Телефон" />
        )}
      />
    </form>
  );
}
