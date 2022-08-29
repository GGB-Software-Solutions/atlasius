import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Box, css } from "@mui/material";
import { Company } from "./types";
import { warehouses } from "../../mocks/mocks";
import EcommerceCredentialsForm from "./EcommerceCredentialsForm";
import DeliveryCompaniesForm from "./DeliveryCompaniesForm";

interface Props {
  data: Company;
  onSave: (data: Company) => void;
}

export default function CompanyForm({ data, onSave }: Props) {
  const formContext = useForm({
    defaultValues: data,
  });

  return (
    <FormContainer
      formContext={formContext}
      FormProps={{
        id: "myform",
      }}
      onSuccess={onSave}
    >
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          grid-gap: 16px;
        `}
      >
        <TextFieldElement
          variant="standard"
          name="name"
          label="Име на компания"
          required
        />
        <TextFieldElement
          variant="standard"
          name="responsiblePerson"
          label="МОЛ"
          required
        />
        <TextFieldElement
          variant="standard"
          name="vatNumber"
          label="ДДС номер"
          required
        />
        <TextFieldElement
          variant="standard"
          name="phone"
          label="Телефон"
          required
        />
        <TextFieldElement
          fullWidth
          variant="standard"
          name="email"
          type="email"
          label="Имейл"
          required
          sx={{
            width: 320,
          }}
        />
        <AutocompleteElement
          textFieldProps={{
            variant: "standard",
            sx: {
              width: 160,
            },
          }}
          autocompleteProps={{
            getOptionLabel: (option) => option.name,
          }}
          name="warehouses"
          label="Складове"
          multiple
          options={warehouses}
        />
        <DeliveryCompaniesForm formContext={formContext} />
        <EcommerceCredentialsForm formContext={formContext} />
      </Box>
    </FormContainer>
  );
}
