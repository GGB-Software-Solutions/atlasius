import {
  DeliveryCompany,
  DeliveryCompanyCredentials,
} from "./pages/Companies/types";
import { getContentsDescription } from "./pages/Orders/utils";
import { MappedOrder, PaymentType } from "./types";
import {
  Address,
  CDPayOptions,
  City,
  ClientProfile,
  Country,
  Office,
  ShipmentStatus,
  ShipmentType,
  ShippingLabel,
  ShippingLabelServices,
} from "./types/econt";

const ECONT_DEMO_API_URL = "http://demo.econt.com/ee/services";
const ECONT_API_URL = "http://ee.econt.com/services";
const ECONT_DEMO_API_USERNAME = process.env.NEXT_PUBLIC_ECONT_DEMO_API_USERNAME;
const ECONT_DEMO_API_PASSWORD = process.env.NEXT_PUBLIC_ECONT_DEMO_API_PASSWORD;

const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST_API_MODE = process.env.NEXT_PUBLIC_ECONT_API_MODE === "test";

const getBasicAuth = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const getInnerErrors = (response): string => {
  if (response.innerErrors.length > 0) {
    return getInnerErrors(response.innerErrors[0]);
  } else {
    return response.message;
  }
};

interface FetcherProps {
  url: string;
  body?: Record<string, unknown>;
  credentials?: Pick<DeliveryCompanyCredentials, "username" | "password">;
  testMode?: boolean;
}

export const TEST_CREDENTIALS = {
  username: ECONT_DEMO_API_USERNAME,
  password: ECONT_DEMO_API_PASSWORD,
};

export const fetcher = async ({
  url,
  body = {},
  credentials,
  testMode = false,
}: FetcherProps) => {
  let isRealMode;

  if (testMode) {
    isRealMode = false;
  } else {
    isRealMode = IS_PROD || !IS_TEST_API_MODE;
  }

  const absoluteUrl = `${
    isRealMode ? ECONT_API_URL : ECONT_DEMO_API_URL
  }/${url}`;
  const auth =
    (isRealMode ? credentials?.username : ECONT_DEMO_API_USERNAME) +
    ":" +
    (isRealMode ? credentials?.password : ECONT_DEMO_API_PASSWORD);
  const response = await fetch(absoluteUrl, {
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
  credentials:
    | Pick<DeliveryCompanyCredentials, "username" | "password">
    | undefined;
  testMode: boolean;
  constructor(
    credentials?: Pick<DeliveryCompanyCredentials, "username" | "password">,
    testMode: boolean = false
  ) {
    //If the credentials are not provided we fallback to demo credentials and it's reponsibility of the caller to decide whether to call or not the service
    this.credentials = credentials;
    this.testMode = testMode;
  }

  async getCountries(): Promise<Country[]> {
    const url = "Nomenclatures/NomenclaturesService.getCountries.json";
    const data = await fetcher({
      url,
      credentials: this.credentials,
      testMode: this.testMode,
    });
    return data.countries;
  }

  async getCities(countryCode = "BGR"): Promise<City[]> {
    const url = "Nomenclatures/NomenclaturesService.getCities.json";
    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        countryCode,
        url,
        credentials: this.credentials,
        testMode: this.testMode,
      }),
    });
    const data = await response.json();
    return data.cities;
  }

  async getStreets(cityID: number): Promise<Address[]> {
    const url = "Nomenclatures/NomenclaturesService.getStreets.json";

    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        cityID,
        url,
        credentials: this.credentials,
        testMode: this.testMode,
      }),
    });
    const data = await response.json();
    return data.streets;
  }

  async getOffices(countryCode = "BGR", cityID: number): Promise<Office[]> {
    const url = "Nomenclatures/NomenclaturesService.getOffices.json";
    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        cityID,
        countryCode,
        url,
        credentials: this.credentials,
        testMode: this.testMode,
      }),
    });
    const data = await response.json();
    return data.offices;
  }

  async getClientProfiles() {
    const url = "Profile/ProfileService.getClientProfiles.json";

    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        credentials: this.credentials,
        testMode: this.testMode,
        url,
      }),
    });
    const data = await response.json();

    return data.profiles[0];
  }

  // Address (minimum required parameters: city name, street name and street number or quarter and other)
  async validateAddress(
    city: string,
    street: string,
    streetNumber: string,
    postCode: string
  ) {
    const url = "Nomenclatures/AddressService.validateAddress.json";

    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        address: {
          city: {
            name: city,
            // postCode,
          },
          street,
          num: streetNumber,
        },
        url,
        credentials: this.credentials,
        testMode: this.testMode,
      }),
    });
    const data = await response.json();

    let error = null;
    let address = null;
    if (data.innerErrors) {
      error = getInnerErrors(data);
    } else if (data.validationStatus === "normal") {
      address = data.address;
    }
    return { error, address };
  }

  // When preparing a shipment, the addresses of the sender, receiver, and any other parties (who will receive the amount collected from the service "cash on delivery", receive a returned shipment, etc.) need to be valid according to the following criteria:
  // 1. Valid post code and city name
  // 2. At least one of the following:
  // valid street name (tag <street>) and number (tag <num>)
  // valid neighbourhood name (tag <quarter>) and a value for other address related information (tag <other>)
  // for cities with missing street data: street name without validation (tag <street>) and number (tag < num>)
  // for shipments on request (sent to Econt office): valid Econt office code (tag <office_code>)
  async createLabel(label: ShippingLabel): Promise<ShipmentStatus> {
    const url = "Shipments/LabelService.createLabel.json";

    const response = await fetch("api/econt", {
      method: "POST",
      body: JSON.stringify({
        label,
        mode: "create",
        credentials: this.credentials,
        testMode: this.testMode,
        url,
      }),
    });
    const data = await response.json();
    return data;
  }

  async generateShippingLabel(order: MappedOrder<DeliveryCompany.Econt>) {
    const profile = await this.getClientProfiles();
    const econtCredentials = order.company.deliveryCompanyCredentials.find(
      (credentials) => credentials.deliveryCompanyName === DeliveryCompany.Econt
    );

    const senderClient: ClientProfile = profile.client;
    const senderAgent = {
      name: econtCredentials?.senderAgent,
      email: profile.client.email,
    };

    // Bokar manastirski livadi office
    const senderOfficeCode = "1137"; //TODO: Fix this?

    const receiverClient: ClientProfile = {
      name: `${order.firstName} ${order.lastName}`,
      phones: [order.phone],
    };
    const receiverOfficeCode = order.office?.code;
    let receiverAddress = null;

    if (!receiverOfficeCode) {
      receiverAddress = order.validatedAddress;
    }

    const packCount = 1;
    const shipmentType = ShipmentType.pack;
    const weight = order.products.reduce((prevValue, currValue) => {
      return prevValue + currValue.orderedQuantity * currValue.weight;
    }, 0);
    const shipmentDescription = getContentsDescription(order);

    const services: { services?: Partial<ShippingLabelServices> } =
      order.paymentType === PaymentType.CARD
        ? {}
        : {
            services: {
              cdAmount: order.price,
              cdType: "get",
              cdCurrency: "BGN",
              cdPayOptions: (profile.cdPayOptions as CDPayOptions[]).find(
                (option) => option.num === econtCredentials?.agreementId
              ),
            },
          };

    const label: ShippingLabel = {
      payAfterAccept: true,
      senderClient,
      senderOfficeCode,
      senderAgent,
      receiverAddress,
      receiverClient,
      receiverOfficeCode,
      packCount,
      shipmentType,
      ...services,
      instructions: profile.instructionTemplates,
      weight,
      shipmentDescription,
      paymentSenderMethod: "credit",
    };

    return this.createLabel(label);
  }
}

export default Econt;
