import React from "react";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { AutocompleteElement, TextFieldElement } from "react-hook-form-mui";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Company } from "../Companies/types";
import { FormProduct, ProductWarehouseQuantity } from "../../types/product";

interface Props {
  formContext: UseFormReturn<FormProduct>;
  isNew: boolean;
}

const renderField = (
  key: string,
  index: number,
  register: UseFormRegister<FormProduct>,
  remove: UseFieldArrayRemove,
  isNew: boolean,
  company: Company
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
      <Grid item xs={5} sm={4} md={3}>
        <AutocompleteElement
          {...register(`productWarehouseQuantities.${index}.warehouseId`)}
          textFieldProps={{
            variant: "standard",
          }}
          autocompleteProps={{
            getOptionLabel: (option) => option.name,
            onChange: () => {},
          }}
          matchId
          label="Склад"
          options={company?.warehouse || []}
          required
        />
      </Grid>
      <Grid item xs={2} sm={1.5} md={1.5}>
        <TextFieldElement
          variant="standard"
          {...register(`productWarehouseQuantities.${index}.itemLocation`)}
          label="Локация в склад"
          required
        />
      </Grid>
      <Grid item xs={1.5} sm={1.5} md={1.5}>
        <TextFieldElement
          variant="standard"
          {...register(`productWarehouseQuantities.${index}.quantity`)}
          label="Обща бройка"
          type="number"
          required
          fullWidth
        />
      </Grid>
      <Grid item xs={4} sm={3} md={2}>
        <TextFieldElement
          variant="standard"
          {...register(`productWarehouseQuantities.${index}.reserved`)}
          label="Запазени"
          type="number"
          required={!isNew}
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
    name: "productWarehouseQuantities",
  });
  const company = formContext.watch("company");

  const render = React.useCallback(
    (item: Record<"id", string>, index: number) =>
      renderField(item.id, index, formContext.register, remove, isNew, company),
    [company]
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
        <IconButton
          color="primary"
          onClick={() => append({} as ProductWarehouseQuantity)}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      {fields.map(render)}
    </>
  );
}
