import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Grid, Typography } from "@mui/material";
import { companies, warehouses as mockWarehouses } from "../../mocks/mocks";
import { Product } from "../../types";
import ProductWarehouseQuantityForm from "./ProductWarehouseQuantityForm";

interface Props {
  data: Product;
  onSave: (data: Product) => void;
}

export default function ProductForm({ data, onSave }: Props) {
  const formContext = useForm({
    defaultValues: data,
  });

  const isNew = !Boolean(data.id);

  return (
    <FormContainer
      formContext={formContext}
      FormProps={{
        id: "myform",
      }}
      onSuccess={(data) => {
        console.log("DATA:", data);
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          mb: 4,
        }}
      >
        <Grid item xs={6} md={4}>
          <TextFieldElement
            variant="standard"
            name="name"
            label="Име на продукт"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextFieldElement
            variant="standard"
            name="sku"
            label="SKU"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextFieldElement
            variant="standard"
            name="ean"
            label="Баркод"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextFieldElement
            variant="standard"
            name="category"
            label="Категория"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextFieldElement
            variant="standard"
            name="weight"
            label="Тегло"
            type="number"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <AutocompleteElement
            textFieldProps={{
              variant: "standard",
            }}
            autocompleteProps={{
              getOptionLabel: (option) => option.name,
              fullWidth: true,
            }}
            name="company"
            label="Компания"
            options={companies}
            required
          />
        </Grid>
      </Grid>
      <ProductWarehouseQuantityForm formContext={formContext} isNew={isNew} />
    </FormContainer>
  );
}
