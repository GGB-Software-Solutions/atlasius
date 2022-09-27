import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Button, FormControlLabel, Grid, Switch } from "@mui/material";
import Econt, { getInnerErrors } from "../../../econt";
import { MappedOrder } from "../../../types";
import { Address, City, Country } from "../../../types/econt";
import useStore from "../../../store/globalStore";
import VirtualizedAutocomplete from "./VirtualizedAutocomplete";

import useEcont from "./useEcont";
import {
  generateShippingLabel,
  shouldOrderBeDeliveredToOffice,
} from "../utils";
import { DeliveryCompany } from "../../Companies/types";
import ValidAddress from "./ValidAddress";
import { OrderShippingDetails, updateShippingDetails } from "../api";

type MappedEcontOrder = MappedOrder<DeliveryCompany.Econt>;

interface Props {
  data: MappedEcontOrder;
  hideGenerateShippingLabel?: boolean;
  onSave: (data: MappedEcontOrder) => void;
}

export default function ShippingForm({
  data,
  onSave,
  hideGenerateShippingLabel = false,
}: Props) {
  const setNotification = useStore((state) => state.setNotification);
  const [deliverToOffice, setDeliverToOffice] = React.useState(
    shouldOrderBeDeliveredToOffice(data)
  );
  const [validatedAddress, setValidatedAddress] = React.useState<Address>(
    Boolean(data.validatedAddress)
  );
  const econtCountries = useStore((state) => state.econtCountries);
  const econtOffices = useStore((state) => state.econtOffices);
  const formContext = useForm({
    defaultValues: data,
  });
  const country = formContext.watch("country") as Country;
  const city = formContext.watch("city");
  const office = formContext.watch("office");

  const econtService = React.useRef(new Econt()).current;
  const {
    offices = [],
    streets = [],
    cities = [],
    isLoadingCities,
    isLoadingOffices,
    isLoadingStreets,
  } = useEcont({
    countryCode: country?.code3,
    cityID: typeof city === "string" ? undefined : city?.id,
    deliverToOffice,
  });

  const isLoading = isLoadingCities;

  const updateDetails = async (
    data: MappedEcontOrder,
    validatedEcontAddres = {}
  ) => {
    const { country, id } = data;
    let shippingDetails: OrderShippingDetails = {};
    if (deliverToOffice) {
      shippingDetails = {
        id,
        officeId: office?.code,
        country: (country as Country).name,
      };
    } else {
      shippingDetails = {
        id,
        address1: validatedEcontAddres.fullAddress,
        city: validatedEcontAddres.city.name,
        zipCode: validatedEcontAddres.zip,
        country: validatedEcontAddres.city.country.name,
        streetName: validatedEcontAddres.street,
        streetNumber: validatedEcontAddres.num,
        officeId: undefined,
      };
    }
    const response = await updateShippingDetails(shippingDetails);
    if (response.success) {
      setNotification({ type: "success", message: response.success });
      onSave();
    } else {
      setNotification({ type: "error", message: response.error });
    }
  };

  const handleSubmit = async (data: MappedEcontOrder) => {
    const { streetNumber, street, zipCode, city } = data;
    if (deliverToOffice) return updateDetails(data);

    const { error, address } = await econtService.validateAddress(
      typeof city === "string" ? city : city?.name,
      street?.name,
      streetNumber,
      zipCode
    );

    if (error) {
      setNotification({ type: "error", message: error });
    } else {
      formContext.setValue("address1", address.fullAddress);
      setValidatedAddress(address);
      updateDetails(data, address);
    }
  };

  const handleGenerateShippingLabel = async () => {
    const response = await generateShippingLabel(data);
    if (response.innerErrors) {
      setNotification({ type: "error", message: getInnerErrors(response) });
      return;
    }
    const printJS = (await import("print-js")).default;
    printJS(response.pdfURL);
  };

  const handleCheckboxChange = (_, checked: boolean) =>
    setDeliverToOffice(checked);

  return (
    <>
      <ValidAddress
        isValid={deliverToOffice ? Boolean(office) : Boolean(validatedAddress)}
        isLoading={isLoading}
        deliverToOffice={deliverToOffice}
        deliveryCompany={DeliveryCompany.Econt}
      />
      <FormControlLabel
        control={
          <Switch
            checked={deliverToOffice}
            disabled
            onChange={handleCheckboxChange}
          />
        }
        label="До офис"
      />

      <FormContainer formContext={formContext} onSuccess={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{
            mb: 4,
          }}
        >
          <Grid item xs={6} md={4}>
            <AutocompleteElement
              textFieldProps={{
                variant: "standard",
              }}
              autocompleteProps={{
                fullWidth: true,
                isOptionEqualToValue(option, value) {
                  return option.code2 === value.code2;
                },
                getOptionLabel(option: Country) {
                  return `${option.name}  - ${option.nameEn}`;
                },
              }}
              name="country"
              label="Държава"
              options={econtCountries}
              required
            />
          </Grid>
          {!deliverToOffice && (
            <>
              <Grid item xs={6} md={4}>
                <VirtualizedAutocomplete
                  name="city"
                  label="Град"
                  options={cities}
                  required
                  loading={isLoadingCities}
                  autocompleteProps={{
                    disabled: !country,
                    getOptionLabel(option) {
                      if (typeof option === "string") return "";
                      const { postCode, name, nameEn } = option;
                      return `${postCode} - ${name} - ${nameEn}`;
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="zipCode"
                  label="Пощенски код"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="quarter"
                  label="Квартал"
                  fullWidth
                />
              </Grid>
            </>
          )}
          {!deliverToOffice ? (
            <>
              <Grid item xs={6} md={4}>
                <VirtualizedAutocomplete
                  name="street"
                  label="Улица"
                  options={streets}
                  required
                  loading={isLoadingStreets}
                  autocompleteProps={{
                    disabled: !city,
                    getOptionLabel({ name, nameEn }) {
                      return `${name} - ${nameEn}`;
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="streetNumber"
                  label="Номер на улица"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="address1"
                  label="Адрес 1"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="address2"
                  label="Адрес 2"
                  fullWidth
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={6} md={4}>
              <VirtualizedAutocomplete
                name="office"
                label="Офис"
                options={offices}
                required
                loading={isLoadingOffices}
                autocompleteProps={{
                  disabled: !city,
                  getOptionLabel({ name, nameEn }) {
                    return `${name} - ${nameEn}`;
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
        <Button variant="contained" type="submit" color="primary">
          Запази
        </Button>
        {!hideGenerateShippingLabel && (
          <Button
            variant="contained"
            onClick={handleGenerateShippingLabel}
            color="primary"
          >
            Генерирай товарителница
          </Button>
        )}
      </FormContainer>
    </>
  );
}
