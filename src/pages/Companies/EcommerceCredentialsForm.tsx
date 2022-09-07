import { IconButton, Stack, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { SelectElement, TextFieldElement } from "react-hook-form-mui";
import { getSelectOptions } from "../../utils/common";
import { Company, Ecommerce } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ecommerceOptions = getSelectOptions(Ecommerce);

interface Props {
  formContext: UseFormReturn<Company>;
}

const EcommerceCredentialsForm = ({ formContext }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: formContext.control,
    name: "ecommerceCredentials",
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
        <Typography variant="h6">E-commerce</Typography>
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
              options={ecommerceOptions}
              {...formContext.register(`ecommerceCredentials.${index}.name`)}
              objectOnChange
              label="E-commerce"
              onChange={(data) => {}}
            />
            <TextFieldElement
              {...formContext.register(`ecommerceCredentials.${index}.url`)}
              variant="standard"
              label="URL"
              required
            />
            <TextFieldElement
              {...formContext.register(
                `ecommerceCredentials.${index}.username`
              )}
              variant="standard"
              label="Потребител"
              required
            />
            <TextFieldElement
              {...formContext.register(
                `ecommerceCredentials.${index}.password`
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
};

export default EcommerceCredentialsForm;
