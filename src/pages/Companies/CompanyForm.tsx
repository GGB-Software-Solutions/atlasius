import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Grid } from "@mui/material";
import { Company } from "./types";
import EcommerceCredentialsForm from "./EcommerceCredentialsForm";
import DeliveryCompaniesForm from "./DeliveryCompaniesForm";
import useStore from "../../store/globalStore";

interface Props {
  data: Company;
  onSave: (data: Company) => void;
}

export default function CompanyForm({ data, onSave }: Props) {
  const formContext = useForm({
    defaultValues: data,
  });
  const warehouses = useStore((state) => state.warehouses);

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
          <TextFieldElement
            variant="standard"
            name="name"
            label="Име на компания"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldElement
            variant="standard"
            name="responsiblePerson"
            label="МОЛ"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldElement
            variant="standard"
            name="vatNumber"
            label="ДДС номер"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldElement
            variant="standard"
            name="phone"
            label="Телефон"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteElement
            textFieldProps={{
              variant: "standard",
              fullWidth: true,
            }}
            autocompleteProps={{
              getOptionLabel: (option) => option.name,
            }}
            name="warehouse"
            label="Складове"
            multiple
            options={warehouses}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldElement
            fullWidth
            variant="standard"
            name="email"
            type="email"
            label="Имейл"
            required
          />
        </Grid>
      </Grid>
      <DeliveryCompaniesForm formContext={formContext} />
      <EcommerceCredentialsForm formContext={formContext} />
    </FormContainer>
  );
}
