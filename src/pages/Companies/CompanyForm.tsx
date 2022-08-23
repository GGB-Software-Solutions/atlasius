import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
  SelectElement,
} from "react-hook-form-mui";
import {
  Box,
  css,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Company, DeliveryCompany, Ecommerce } from "./types";
import { warehouses } from "../../mocks/mocks";
import { getSelectOptions } from "../../utils/common";
import EcommerceCredentialsForm from "./EcommerceCredentialsForm";
import DeliveryCompaniesForm from "./DeliveryCompaniesForm";

interface Props {
  data: Company;
  onSave: (data: Company) => void;
}

// TODO: Add warehouses on application startup
// TODO: Parse import excel to json
// TODO: Add table for items that are imported from the json
// TODO: Add buttons in the table rows to lower quantity and remove the whole row
// TODO: Add button to add new row with product data
// TODO: Add button to submit the products to the backend

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
      onSuccess={(data) => {
        console.log("DATA:", data);
      }}
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
