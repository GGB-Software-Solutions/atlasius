import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
  SelectElement,
} from "react-hook-form-mui";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { getSelectOptions } from "../../utils/common";
import { DeliveryCompany } from "../Companies/types";
import { API_ENDPOINTS } from "../../api";
import { jsonFetch } from "../../utils/fetch";
import useSWR from "swr";
import { ProductResponse } from "../../types/product";
import { Order, PaymentType } from "../../types";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shouldOrderBeDeliveredToOffice } from "../Orders/utils";

interface Props {
  data: Order;
  onSave: (data: Order) => void;
}

const deliveryCompanies = getSelectOptions(DeliveryCompany);
const paymentTypes = getSelectOptions(PaymentType);

export default function OrderDialog({
  data: formData,
  onSave,
  open,
  onClose,
}: Props) {
  const formContext = useForm({
    defaultValues: formData,
  });
  const [toOffice, setToOffice] = React.useState(
    shouldOrderBeDeliveredToOffice(formData)
  );
  const {
    data: products,
    error,
    isLoading,
  } = useSWR<ProductResponse[]>(API_ENDPOINTS.Product, jsonFetch);

  const handleChange = (e) => {
    setToOffice(e.target.checked);
  };

  formContext.watch("products");

  const disabled = Boolean(formData.id);

  const handleAdd = (index: number) => () => {
    formContext.setValue(
      `products.${index}.orderedQuantity`,
      (formContext.getValues(`products.${index}.orderedQuantity`) || 0) + 1
    );
  };

  const handleRemove = (index: number) => () => {
    formContext.setValue(
      `products.${index}.orderedQuantity`,
      (formContext.getValues(`products.${index}.orderedQuantity`) || 0) - 1
    );
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xl">
      <DialogTitle>
        {formData.id ? `Поръчка - ${formData.id}` : "Нова поръчка"}
      </DialogTitle>
      <DialogContent>
        <FormContainer
          formContext={formContext}
          FormProps={{
            id: "myform",
          }}
          onSuccess={onSave}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }} elevation={5}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="firstName"
                      label="Име"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="lastName"
                      label="Фамилия"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="email"
                      label="E-mail"
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="phone"
                      label="Телефон"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }} elevation={5}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="country"
                      label="Държава"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="countryCode"
                      label="Код на държава"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="city"
                      label="Град"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="zipCode"
                      label="Пощенски код"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="streetName"
                      label="Улица"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="streetNumber"
                      label="Номер на улица"
                      required
                      fullWidth
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }} elevation={5}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <SelectElement
                      variant="standard"
                      fullWidth
                      disabled={disabled}
                      options={deliveryCompanies}
                      name="deliveryProvider"
                      label="Куриер"
                      objectOnChange
                      onChange={() => {}}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={toOffice}
                          onChange={handleChange}
                          disabled={disabled}
                        />
                      }
                      label="До офис"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldElement
                      variant="standard"
                      name="officeName"
                      label="Офис"
                      required
                      fullWidth
                      disabled={!toOffice || disabled}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextFieldElement
                      disabled={disabled}
                      fullWidth
                      variant="standard"
                      name="price"
                      label="Цена"
                      required
                      type={"number"}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectElement
                      variant="standard"
                      fullWidth
                      disabled={disabled}
                      options={paymentTypes}
                      name="paymentType"
                      label="Начин на плащане"
                      objectOnChange
                      onChange={() => {}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AutocompleteElement
                      textFieldProps={{
                        variant: "standard",
                        fullWidth: true,
                      }}
                      autocompleteProps={{
                        disabled,
                        getOptionLabel: (option) =>
                          `${option.name}(${option.quantity})`,
                        getOptionDisabled: (option) => option.quantity === 0,
                        renderTags: (value, getTagProps) => {
                          return value.map((item, index) => (
                            <Chip
                              label={item.name}
                              icon={
                                <ButtonGroup
                                  variant="text"
                                  aria-label="text button group"
                                >
                                  <IconButton
                                    size="small"
                                    onClick={handleAdd(index)}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                  {
                                    <Typography variant="h6">
                                      {formContext.getValues(
                                        `products.${index}.orderedQuantity`
                                      ) || 0}
                                    </Typography>
                                  }
                                  <IconButton
                                    size="small"
                                    onClick={handleRemove(index)}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                </ButtonGroup>
                              }
                              {...getTagProps({ index })}
                            />
                          ));
                        },
                      }}
                      name="products"
                      label="Продукти"
                      multiple
                      options={products || []}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Затвори</Button>
        <Button variant="contained" type="submit" color="primary" form="myform">
          Добави
        </Button>
      </DialogActions>
    </Dialog>
  );
}
