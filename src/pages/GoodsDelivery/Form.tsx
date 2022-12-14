import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  AutocompleteElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { Grid } from "@mui/material";
import { Warehouse } from "../../types";
import { Company } from "../Companies/types";
import useStore from "../../store/globalStore";

export interface FormData {
  company: Company | undefined;
  warehouse: Warehouse | undefined;
  itemLocation: string;
}

interface Props {
  onSave: (data: FormData) => void;
}

export default function Form({ onSave }: Props) {
  const companies = useStore((state) => state.companies);
  const selectedCompany = useStore((state) => state.selectedCompany);
  const formContext = useForm<FormData>({
    defaultValues: {
      company: selectedCompany,
    },
  });

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
            options={company?.warehouse || []}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldElement
            variant="standard"
            name="itemLocation"
            label="Локация в склад"
            required
            fullWidth
            disabled={!Boolean(company)}
          />
        </Grid>
      </Grid>
    </FormContainer>
  );
}
