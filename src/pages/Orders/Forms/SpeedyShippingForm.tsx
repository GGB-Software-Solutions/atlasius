import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import { Button, FormControlLabel, Grid, Switch } from "@mui/material";
import { MappedOrder } from "../../../types";
import useStore from "../../../store/globalStore";
import VirtualizedAutocomplete from "./VirtualizedAutocomplete";
import {
  generateSpeedyShippingLabel,
  shouldOrderBeDeliveredToOffice,
} from "../utils";
import { DeliveryCompany } from "../../Companies/types";
import SearchAsYouTypeAutocomplete from "./SearchAsYouTypeAutocomplete";
import { speedyCountries } from "../../../speedy-countries";
import { SpeedyCountry } from "../../../types/speedy";
import {
  findSite,
  getComplexes,
  getStreets,
  printLabel,
  validateAddress,
} from "../../../speedy-api";
import useSpeedy from "./useSpeedy";
import ValidAddress from "./ValidAddress";
import { OrderShippingDetails, updateShippingDetails } from "../api";

type MappedSpeedyOrder = MappedOrder<DeliveryCompany.Speedy>;

interface Props {
  data: MappedSpeedyOrder;
  onSave: (data: MappedSpeedyOrder) => void;
}

export default function SpeedyShippingForm({ data, onSave }: Props) {
  const setNotification = useStore((state) => state.setNotification);
  const [deliverToOffice, setDeliverToOffice] = React.useState(
    shouldOrderBeDeliveredToOffice(data)
  );
  const [validAddress, setValidAddress] = React.useState(
    Boolean(data.validatedAddress)
  );
  const formContext = useForm({
    defaultValues: data,
  });
  const country = formContext.watch("country") as SpeedyCountry;
  const city = formContext.watch("city");
  const office = formContext.watch("office");
  const street = formContext.watch("street");
  const streetNumber = formContext.watch("streetNumber");
  const address1 = formContext.watch("address1");

  const { offices = [], isLoadingOffices } = useSpeedy({
    countryId: country?.id,
    deliverToOffice,
  });

  const isLoading = false;

  const handleSubmit = async (data: MappedSpeedyOrder) => {
    let shippingDetails: OrderShippingDetails = {};
    if (deliverToOffice) {
      shippingDetails = {
        officeId: office?.id.toString(),
        country: country.name,
      };
    } else {
      const address = {
        countryId: country.id,
        siteId: city.id,
        postCode: data.zipCode,
        streetId: street?.id,
        streetNo: streetNumber,
        addressNote: address1,
      };
      const { error } = await validateAddress(address);

      if (error) {
        setNotification({ type: "error", message: error.message });
      } else {
        setNotification({
          type: "success",
          message: "Адресът е валиден и запазен успешно.",
        });
        setValidAddress(true);
        shippingDetails = {
          address1: address.addressNote,
          city: typeof city === "string" ? city : city?.name,
          zipCode: address.postCode,
          country: country.name,
          streetName: street?.name,
          streetNumber: address.streetNo,
        };
        const response = await updateShippingDetails(shippingDetails);
        //TODO: Show notification if successful/error
      }
    }
  };

  const handleCheckboxChange = (_, checked: boolean) =>
    setDeliverToOffice(checked);

  const handleGenerateShippingLabel = async () => {
    const response = await generateSpeedyShippingLabel(data);
    if (response.error) {
      setNotification({
        type: "error",
        message: response.error.message,
      });
      return;
    }
    const label = await printLabel(response.parcels[0].id);
    const printJS = (await import("print-js")).default;
    printJS({ printable: label, type: "pdf", base64: true });
  };

  const cityFetch = async (inputValue: string, callback) => {
    const country = formContext.getValues().country;
    const data = await findSite({ countryId: country.id, name: inputValue });
    callback(data);
  };

  const streetFetch = async (inputValue: string, callback) => {
    const city = formContext.getValues().city;
    const data = await getStreets({ siteId: city.id, name: inputValue });
    callback(data);
  };

  const complexFetch = async (inputValue: string, callback) => {
    const city = formContext.getValues().city;
    const data = await getComplexes({ siteId: city.id, name: inputValue });
    callback(data);
  };

  return (
    <>
      <ValidAddress
        isValid={deliverToOffice ? Boolean(office) : validAddress}
        isLoading={isLoading}
        deliverToOffice={deliverToOffice}
        deliveryCompany={DeliveryCompany.Speedy}
      />

      <FormControlLabel
        control={
          <Switch checked={deliverToOffice} onChange={handleCheckboxChange} />
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
                getOptionLabel(option: SpeedyCountry) {
                  return option.name;
                },
              }}
              name="country"
              label="Държава"
              options={speedyCountries}
              required
            />
          </Grid>
          {!deliverToOffice && (
            <>
              <Grid item xs={6} md={4}>
                <SearchAsYouTypeAutocomplete
                  fetch={cityFetch}
                  name="city"
                  label="Град"
                  required
                  autocompleteProps={{
                    disabled: !country,
                    getOptionLabel(option) {
                      if (typeof option === "string") return option;
                      return `${option.type}${option.name},п.к.${option.postCode},общ.${option.municipality},обл.${option.region}`;
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
                <SearchAsYouTypeAutocomplete
                  fetch={complexFetch}
                  name="quarter"
                  label="Квартал"
                  required
                  autocompleteProps={{
                    disabled: !city,
                    getOptionLabel(option) {
                      if (typeof option === "string") return option;
                      return `${option.type} ${option.name}`;
                    },
                  }}
                />
              </Grid>
            </>
          )}
          {!deliverToOffice ? (
            <>
              <Grid item xs={6} md={4}>
                <SearchAsYouTypeAutocomplete
                  fetch={streetFetch}
                  name="street"
                  label="Улица"
                  autocompleteProps={{
                    disabled: !city,
                    getOptionLabel(option) {
                      if (typeof option === "string") return option;
                      return `${option.name}`;
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="streetNumber"
                  label="Номер на улица"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextFieldElement
                  variant="standard"
                  name="address1"
                  label="Адрес 1"
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
            <Grid item xs={6} md={8}>
              <VirtualizedAutocomplete
                name="office"
                label="Офис"
                options={offices}
                required
                loading={isLoadingOffices}
                autocompleteProps={{
                  disabled: !city,
                  getOptionLabel(option) {
                    if (typeof option === "string") return option;
                    return `${option.name} - ${option?.address?.localAddressString}`;
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
        <Button variant="contained" type="submit" color="primary">
          Запази
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerateShippingLabel}
          color="primary"
        >
          Генерирай товарителница
        </Button>
      </FormContainer>
    </>
  );
}
