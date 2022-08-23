import React from "react";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";
import { Company, DeliveryCompany } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Warehouse } from "../../types";

interface Props {
  formContext: UseFormReturn<Company>;
  isNew: boolean;
}

const renderField = (
  key: string,
  index: number,
  register,
  remove,
  isNew: boolean,
  warehouses: Warehouse[]
) => {
  return (
    <Grid
      container
      key={key}
      spacing={4}
      sx={{
        mb: 4,
      }}
    >
      <Grid item xs={5} sm={3} md={2}>
        <AutocompleteElement
          {...register(`warehouseQuantities.${index}.deliveryCompanyId`)}
          textFieldProps={{
            variant: "standard",
          }}
          autocompleteProps={{
            getOptionLabel: (option) => option.name,
            onChange: () => {},
          }}
          label="Склад"
          options={warehouses}
          required
        />
      </Grid>
      <Grid item xs={4} sm={4} md={3}>
        <TextFieldElement
          variant="standard"
          {...register(`warehouseQuantities.${index}.itemLocation`)}
          label="Локация в склад"
          required
        />
      </Grid>
      <Grid item xs={4} sm={3} md={2}>
        <TextFieldElement
          variant="standard"
          {...register(`warehouseQuantities.${index}.quantity`)}
          label="Обща бройка"
          type="number"
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={4} sm={3} md={2}>
        <TextFieldElement
          variant="standard"
          {...register(`warehouseQuantities.${index}.reserved`)}
          label="Запазени"
          type="number"
          required
          fullWidth
          disabled={isNew}
        />
      </Grid>
      <Grid item xs={4} sm={3} md={2}>
        <TextFieldElement
          variant="standard"
          {...register(`warehouseQuantities.${index}.readyToDeliver`)}
          label="Готови за изпращане"
          type="number"
          required
          fullWidth
          disabled={isNew}
        />
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default function ProductWarehouseQuantityForm({
  formContext,
  isNew,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: "warehouseQuantities",
  });
  const company = formContext.watch("company");

  const render = React.useCallback(
    (item: Record<"id", string>, index: number) =>
      renderField(
        item.id,
        index,
        formContext.register,
        remove,
        isNew,
        company?.warehouses || []
      ),
    [company?.warehouses]
  );

  return (
    <>
      <Stack
        direction={"row"}
        alignItems="center"
        justifyContent={"space-between"}
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h6">Складова наличност</Typography>
        <IconButton color="primary" onClick={() => append({})}>
          <AddIcon />
        </IconButton>
      </Stack>
      {fields.map(render)}
    </>
  );
}
