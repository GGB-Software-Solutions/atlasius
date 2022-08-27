import React from "react";
import { useForm } from "react-hook-form";
import { FormContainer, AutocompleteElement } from "react-hook-form-mui";
import { Grid } from "@mui/material";
import { companies } from "../../mocks/mocks";
import { Warehouse } from "../../types";
import { Company } from "../Companies/types";

export interface FormData {
  company: Company | undefined;
  warehouse: Warehouse | undefined;
}

interface Props {
  onSave: (data: FormData) => void;
}

export default function Form({ onSave }: Props) {
  const formContext = useForm<FormData>();

  const company = formContext.watch("company");

  return (
    <FormContainer
      formContext={formContext}
      FormProps={{
        id: "myform",
      }}
      onSuccess={onSave}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <AutocompleteElement
            textFieldProps={{
              variant: "standard",
            }}
            autocompleteProps={{
              getOptionLabel: (option) => option.name,
              fullWidth: true,
              disabled: !Boolean(company),
            }}
            name="warehouse"
            label="Склад"
            options={company?.warehouses || []}
            required
          />
        </Grid>
      </Grid>
    </FormContainer>
  );
}
