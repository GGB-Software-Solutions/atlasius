import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { Company } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  formContext: UseFormReturn<Company>;
  index: number;
}

export default function FixedDeliveryOptionsForm({
  formContext,
  index,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: `deliveryCompanyCredentials.${index}.fixedDeliveryOptions`,
  });
  console.log(fields);
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
        <IconButton color="primary" onClick={() => append({})}>
          <AddIcon />
        </IconButton>
      </Stack>
      {fields.map((item, optionIndex) => {
        return (
          <Stack
            direction={"row"}
            alignItems="flex-end"
            spacing={3}
            key={item.id}
            sx={{
              width: "100%",
              mt: 2,
              mb: 2,
            }}
          >
            <>
              <TextFieldElement
                {...formContext.register(
                  `deliveryCompanyCredentials.${index}.fixedDeliveryOptions.${optionIndex}.from`
                )}
                variant="standard"
                label="От"
                required
                fullWidth
              />
              <TextFieldElement
                {...formContext.register(
                  `deliveryCompanyCredentials.${index}.fixedDeliveryOptions.${optionIndex}.to`
                )}
                variant="standard"
                label="До"
                required
                fullWidth
              />
              <TextFieldElement
                {...formContext.register(
                  `deliveryCompanyCredentials.${index}.fixedDeliveryOptions.${optionIndex}.price`
                )}
                variant="standard"
                label="Цена"
                required
                fullWidth
              />
              <IconButton onClick={() => remove(optionIndex)}>
                <DeleteIcon />
              </IconButton>
            </>
          </Stack>
        );
      })}
    </>
  );
}
