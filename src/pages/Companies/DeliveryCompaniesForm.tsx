import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { SelectElement, TextFieldElement } from "react-hook-form-mui";
import { getSelectOptions } from "../../utils/common";
import { Company, DeliveryCompany } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  formContext: UseFormReturn<Company>;
}

const deliveryCompanies = getSelectOptions(DeliveryCompany);

export default function DeliveryCompaniesForm({ formContext }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: "deliveryCompanyCredentials",
  });
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
        <Typography variant="h6">Куриери</Typography>
        <IconButton color="primary" onClick={() => append({})}>
          <AddIcon />
        </IconButton>
      </Stack>
      {fields.map((item, index) => {
        return (
          <Stack
            direction={"row"}
            alignItems="flex-end"
            justifyContent={"space-between"}
            spacing={2}
            key={item.id}
            sx={{
              width: "100%",
            }}
          >
            <SelectElement
              variant="standard"
              sx={{
                width: 100,
              }}
              options={deliveryCompanies}
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.deliveryCompanyId`
              )}
              objectOnChange
              label="Куриер"
              onChange={(data) => {}}
            />
            <TextFieldElement
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.username`
              )}
              variant="standard"
              label="Потребител"
              required
            />
            <TextFieldElement
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.password`
              )}
              variant="standard"
              label="Парола"
              required
            />
            <IconButton onClick={() => remove(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      })}
    </>
  );
}
