import {
  Address,
  City,
  Country,
  Office,
  ShipmentStatus,
  ShippingLabel,
  ValidationAddressPayload,
} from "./types/econt";

const ECONT_DEMO_API_URL = "http://demo.econt.com/ee/services";
const ECONT_API_URL = "http://ee.econt.com/services";
const ECONT_API_USERNAME = "ВАЯ 911";
const ECONT_DEMO_API_USERNAME = "iasp-dev";
const ECONT_API_PASSWORD = "VAQ!2345";
const ECONT_DEMO_API_PASSWORD = "iasp-dev";

const getBasicAuth = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

interface FetcherProps {
  service: "Nomenclatures" | "Shipments" | "Profile";
  subService:
    | "NomenclaturesService"
    | "AddressService"
    | "LabelService"
    | "ProfileService";
  method: string;
  body: Record<string, unknown>;
  isRealMode?: boolean;
}

export const fetcher = async (
  service: string,
  method: string,
  body: Record<string, unknown>,
  mainService: string = "Nomenclatures",
  isRealMode = false
) => {
  const url = `${
    isRealMode ? ECONT_API_URL : ECONT_DEMO_API_URL
  }/${mainService}/${service}.${method}.json`;
  const auth =
    (isRealMode ? ECONT_API_USERNAME : ECONT_DEMO_API_USERNAME) +
    ":" +
    (isRealMode ? ECONT_API_PASSWORD : ECONT_DEMO_API_PASSWORD);
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: [
      ["Content-Type", "application/json"],
      ["Authorization", `Basic ${getBasicAuth(auth)}`],
    ],
  });
  const data = await response.json();
  return data;
};

class Econt {
  isRealMode: boolean = false;
  constructor(isRealMode = false) {
    this.isRealMode = isRealMode;
  }

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

  async getStreets(cityID: number): Promise<Address[]> {
    const data = await fetcher("NomenclaturesService", "getStreets", {
      cityID,
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

  async getClientProfiles() {
    const data = await fetcher(
      "ProfileService",
      "getClientProfiles",
      {},
      "Profile",
      this.isRealMode
    );
    return data.profiles[0];
  }

  // Address (minimum required parameters: city name, street name and street number or quarter and other)
  async validateAddress(
    city: string,
    street: string,
    streetNumber: string,
    postCode: string
  ): Promise<ValidationAddressPayload> {
    const data = await fetcher("AddressService", "validateAddress", {
      address: {
        city: {
          name: city,
          postCode,
        },
        street,
        num: streetNumber,
      },
    });
    return data;
  }

  // When preparing a shipment, the addresses of the sender, receiver, and any other parties (who will receive the amount collected from the service "cash on delivery", receive a returned shipment, etc.) need to be valid according to the following criteria:
  // 1. Valid post code and city name
  // 2. At least one of the following:
  // valid street name (tag <street>) and number (tag <num>)
  // valid neighbourhood name (tag <quarter>) and a value for other address related information (tag <other>)
  // for cities with missing street data: street name without validation (tag <street>) and number (tag < num>)
  // for shipments on request (sent to Econt office): valid Econt office code (tag <office_code>)
  async createLabel(label: ShippingLabel): Promise<ShipmentStatus> {
    const data = await fetcher(
      "LabelService",
      "createLabel",
      {
        label,
        mode: "validate",
      },
      "Shipments",
      this.isRealMode
    );
    return data;
  }
}

export default Econt;
