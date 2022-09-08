import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Grid } from "@mui/material";
import ProductWarehouseQuantityForm from "./ProductWarehouseQuantityForm";
import useStore from "../../store/globalStore";
import { FormProduct } from "../../types/product";

interface Props {
  data: FormProduct;
  onSave: (data: FormProduct) => void;
}

export default function ProductForm({ data, onSave }: Props) {
  const formContext = useForm({
    defaultValues: data,
  });
  const companies = useStore((state) => state.companies);

  const isNew = !Boolean(data.id);

  return (
    <FormContainer
      formContext={formContext}
      FormProps={{
        id: "myform",
      }}
      onSuccess={onSave}
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
