import React from "react";
import {
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import {
  SelectElement,
  TextFieldElement,
  SwitchElement,
} from "react-hook-form-mui";
import { getSelectOptions } from "../../utils/common";
import {
  Company,
  DeliveryCalculationType,
  DeliveryCompany,
  DeliveryPayer,
} from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FixedDeliveryOptionsForm from "./FixedDeliveryOptionsForm";

interface Props {
  formContext: UseFormReturn<Company>;
}

const Field = ({ formContext, index, item, remove }) => {
  const deliveryCompany = formContext.watch(
    `deliveryCompanyCredentials.${index}.deliveryCompanyName`
  );
  const deliveryCalculationType = Number(
    formContext.watch(
      `deliveryCompanyCredentials.${index}.deliveryCalculationType`
    )
  );

  React.useEffect(() => {
    if (deliveryCalculationType === DeliveryCalculationType.Калкулатор) {
      formContext.resetField(
        `deliveryCompanyCredentials.${index}.fixedDeliveryOptions`
      );
    } else {
      formContext.resetField(
        `deliveryCompanyCredentials.${index}.calculatedDeliveryOption.to`
      );
      formContext.resetField(
        `deliveryCompanyCredentials.${index}.calculatedDeliveryOption.payer`
      );
    }
  }, [deliveryCalculationType]);

  return (
    <>
      <Stack
        direction={"row"}
        alignItems="flex-end"
        justifyContent={"space-between"}
        spacing={2}
        key={item.id}
        sx={{
          width: "100%",
          mt: 4,
          mb: 2,
        }}
      >
        <SelectElement
          variant="standard"
          fullWidth
          options={deliveryCompanies}
          {...formContext.register(
            `deliveryCompanyCredentials.${index}.deliveryCompanyName`
          )}
          label="Куриер"
          objectOnChange
          onChange={() => {}}
        />
        <TextFieldElement
          {...formContext.register(
            `deliveryCompanyCredentials.${index}.username`
          )}
          variant="standard"
          label="Потребител"
          required
          fullWidth
        />
        <TextFieldElement
          {...formContext.register(
            `deliveryCompanyCredentials.${index}.password`
          )}
          variant="standard"
          label="Парола"
          required
          fullWidth
        />
        {deliveryCompany === DeliveryCompany.Econt && (
          <>
            <TextFieldElement
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.agreementId`
              )}
              variant="standard"
              label="Номер на споразумение"
              required
              fullWidth
            />
            <TextFieldElement
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.senderAgent`
              )}
              variant="standard"
              label="Изпращач"
              required
              fullWidth
            />
          </>
        )}
        <IconButton onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
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
        <FormControlLabel
          control={
            <Controller
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.payAfterAccept`
              )}
              defaultValue={false}
              render={({ field }) => {
                return <Switch {...field} checked={field.value} />;
              }}
            />
          }
          label="Преглед"
        />
        <FormControlLabel
          control={
            <Controller
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.payAfterTest`
              )}
              defaultValue={false}
              render={({ field }) => (
                <>
                  <Switch {...field} checked={field.value} />
                </>
              )}
            />
          }
          label="Тест и преглед"
        />
        <FormControlLabel
          control={
            <Controller
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.smsOnDelivery`
              )}
              defaultValue={false}
              render={({ field }) => (
                <>
                  <Switch {...field} checked={field.value} />
                </>
              )}
            />
          }
          label="СМС известяване"
        />
      </Stack>
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
        <SelectElement
          variant="standard"
          fullWidth
          options={options}
          {...formContext.register(
            `deliveryCompanyCredentials.${index}.deliveryCalculationType`
          )}
          label="Образуване на цена за доставка"
          objectOnChange
          onChange={() => {}}
        />
        {deliveryCalculationType === DeliveryCalculationType.Калкулатор && (
          <>
            <TextFieldElement
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.calculatedDeliveryOption.to`
              )}
              variant="standard"
              label="До"
              required
              fullWidth
            />
            <SelectElement
              variant="standard"
              fullWidth
              options={deliveryPayerOptions}
              {...formContext.register(
                `deliveryCompanyCredentials.${index}.calculatedDeliveryOption.payer`
              )}
              label="Заплащане на доставка от"
              objectOnChange
              onChange={() => {}}
            />
          </>
        )}
      </Stack>
      {deliveryCalculationType ===
        DeliveryCalculationType["Фиксирана стойност по цена"] && (
        <FixedDeliveryOptionsForm formContext={formContext} index={index} />
      )}
    </>
  );
};

const deliveryCompanies = getSelectOptions(DeliveryCompany);

const options = getSelectOptions(DeliveryCalculationType);
const deliveryPayerOptions = getSelectOptions(DeliveryPayer);

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
          <Field
            index={index}
            formContext={formContext}
            item={item}
            remove={remove}
          />
        );
      })}
    </>
  );
}
