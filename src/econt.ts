import {
  Address,
  City,
  Country,
  Office,
  ValidationAddressPayload,
} from "./types/econt";

const ECONT_DEMO_API_URL = "http://demo.econt.com/ee/services/Nomenclatures";
const ECONT_API_URL = "http://ee.econt.com/services/Nomenclatures";
const ECONT_API_USERNAME = "iasp-dev";
const ECONT_API_PASSWORD = "iasp-dev";

const fetcher = async (
  service: string,
  method: string,
  body: Record<string, unknown>
) => {
  const url = `${ECONT_DEMO_API_URL}/${service}.${method}.json`;
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: [
      ["Content-Type", "application/json"],
      ["Authorization", `Basic ${ECONT_API_USERNAME}:${ECONT_API_PASSWORD}`],
    ],
  });
  const data = await response.json();
  return data;
};

class Econt {
  constructor() {}

  async getCountries(): Promise<Country[]> {
    const data = await fetcher("NomenclaturesService", "getCountries", {});
    return data.countries;
  }

  async getCities(countryCode = "BGR"): Promise<City[]> {
    const data = await fetcher("NomenclaturesService", "getCities", {
      countryCode,
    });
    return data.cities;
  }

  async getStreets(cityId: number): Promise<Address[]> {
    const data = await fetcher("NomenclaturesService", "getStreets", {
      cityId,
    });
    return data.streets;
  }

  async getOffices(countryCode = "BGR", cityID: number): Promise<Office[]> {
    const data = await fetcher("NomenclaturesService", "getOffices", {
      countryCode,
      cityID,
    });
    return data.offices;
  }

  // Address (minimum required parameters: city name, street name and street number or quarter and other)
  async validateAddress(
    city: string,
    street: string,
    streetNumber: string
  ): Promise<ValidationAddressPayload> {
    const data = await fetcher("AddressService", "validateAddress", {
      address: {
        city: {
          name: city,
        },
        street,
        num: streetNumber,
      },
    });
    return data;
  }
}

export default Econt;
