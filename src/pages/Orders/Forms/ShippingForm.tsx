import React from "react";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  TextFieldElement,
  AutocompleteElement,
} from "react-hook-form-mui";
import {
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import Econt from "../../../econt";
import { MappedOrder } from "../../../types";
import { Address, City, Country } from "../../../types/econt";
import useStore from "../../../store/globalStore";
import VirtualizedAutocomplete from "./VirtualizedAutocomplete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import useEcont from "./useEcont";
import {
  generateShippingLabel,
  shouldOrderBeDeliveredToOffice,
} from "../utils";
import { DeliveryCompany } from "../../Companies/types";

type MappedEcontOrder = MappedOrder<DeliveryCompany.Econt>;

interface Props {
  data: MappedEcontOrder;
  onSave: (data: MappedEcontOrder) => void;
}

const map = (order: MappedEcontOrder, countries: Country[]) => ({
  ...order,
  country: countries.find(
    (country) =>
      country.name === order.country || country.nameEn === order.country
  ),
});

export default function ShippingForm({ data, onSave }: Props) {
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
    defaultValues: map(data, econtCountries),
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

  const isLoading = isLoadingCities && isLoadingCities;

  const handleSubmit = async (data: MappedEcontOrder) => {
    console.log("DATA1:", data);
    let toSubmit = {};
    if (deliverToOffice) {
      toSubmit = {
        officeId: data.office.code,
        country: data.country.name,
        city: data.city.name,
      };
    } else {
      const { error, address } = await econtService.validateAddress(
        data.city.name,
        data.street?.name,
        data.streetNumber,
        data.zipCode
      );

      if (error) {
        setNotification({ type: "error", message: error });
      } else {
        formContext.setValue("address1", address.fullAddress);
        setNotification({
          type: "success",
          message: "Адресът е валиден и запазен успешно.",
        });
        setValidatedAddress(address);
        toSubmit = {
          address1: address.fullAddress,
          city: address.city.name,
          zipCode: address.zip,
          country: address.city.country.name,
          streetName: address.street,
          streetNumber: address.num,
        };
      }
      //TODO: We need to submit this to update the order
    }
  };

  const handleCheckboxChange = (_, checked: boolean) =>
    setDeliverToOffice(checked);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <Typography variant="h4">Адрес</Typography>
        {!deliverToOffice && !isLoading && (
          <Chip
            color={validatedAddress ? "success" : "error"}
            icon={validatedAddress ? <CheckCircleIcon /> : <ErrorIcon />}
            label={validatedAddress ? "Валиден адрес" : "Невалиден адрес"}
          />
        )}
      </div>

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
        <Button
          variant="contained"
          onClick={() => {
            generateShippingLabel(data.company, data, null, office.code);
          }}
          color="primary"
        >
          Генерирай товарителница
        </Button>
      </FormContainer>
    </>
  );
}
