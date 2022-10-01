import {
  DeliveryCompany,
  DeliveryCompanyCredentials,
} from "./pages/Companies/types";
import { getContentsDescription } from "./pages/Orders/utils";
import { MappedOrder, PaymentType } from "./types";
import {
  SpeedyAddress,
  SpeedyCountry,
  SpeedyError,
  SpeedyLabel,
} from "./types/speedy";

const BASE_URL = "https://api.speedy.bg/v1";
const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST_API_MODE = process.env.SPEEDY_API_MODE === "test";
export const BULGARIA_COUNTRY_ID = 100;
const SPEEDY_TEST_USERNAME = "1995507";
const SPEEDY_TEST_PASSWORD = "5813296229";

// const SPEEDY_PASSWORD = "7574535198";
// const SPEEDY_USERNAME = "997839";

export const fetcher = async (
  api: string,
  body: Record<string, unknown>,
  isBlob = false
) => {
  const response = await fetch(`${BASE_URL}${api}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = isBlob ? await response.blob() : await response.json();
  return data;
};

interface FindStreetsProps {
  siteId: SpeedyAddress["siteId"];
  name: string;
}

interface FindSiteProps {
  countryId: SpeedyCountry["id"];
  name: string;
}

export const TEST_CREDENTIALS = {
  userName: SPEEDY_TEST_USERNAME,
  password: SPEEDY_TEST_PASSWORD,
};

export class Speedy {
  credentials: { userName: string; password: string };
  isRealMode = IS_PROD || !IS_TEST_API_MODE;
  constructor(credentials?: DeliveryCompanyCredentials) {
    if (!this.isRealMode) {
      this.credentials = TEST_CREDENTIALS;
    } else {
      //If the credentials are not provided we fallback to demo credentials and it's reponsibility of the caller to decide whether to call or not the service
      this.credentials = {
        userName: credentials?.username || SPEEDY_TEST_USERNAME,
        password: credentials?.password || SPEEDY_TEST_PASSWORD,
      };
    }
  }

  async findSite({ countryId, name }: FindSiteProps) {
    const response = await fetch("api/speedy/sites", {
      method: "POST",
      body: JSON.stringify({ countryId, name, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async getOffices(countryId: number) {
    const response = await fetch("api/speedy/sites", {
      method: "POST",
      body: JSON.stringify({ countryId, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async getStreets({ siteId, name }: FindStreetsProps) {
    const response = await fetch("api/speedy/streets", {
      method: "POST",
      body: JSON.stringify({ siteId, name, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async getComplexes({ siteId, name }: FindStreetsProps) {
    const response = await fetch("api/speedy/complex", {
      method: "POST",
      body: JSON.stringify({ siteId, name, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async validateAddress(address: SpeedyAddress) {
    const response = await fetch("api/speedy/address", {
      method: "POST",
      body: JSON.stringify({ address, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async createLabel(label): Promise<SpeedyLabel & { error: SpeedyError }> {
    const response = await fetch("api/speedy/label", {
      method: "POST",
      body: JSON.stringify({ ...label, ...this.credentials }),
    });
    const data = await response.json();
    return data;
  }

  async printLabel(parcelId: string) {
    const body = {
      ...this.credentials,
      type: "print",
      paperSize: "A4",
      parcels: [
        {
          parcel: {
            id: parcelId,
          },
        },
      ],
    };
    const response = await fetch("api/speedy/label", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.text();
    return data;
  }

  async generateLabel(order: MappedOrder<DeliveryCompany.Speedy>) {
    const cod =
      order.paymentType === PaymentType.CARD
        ? {}
        : {
            cod: {
              amount: order.price,
              payoutToLoggedClient: true,
              includeShippingPrice: false,
              processingType: "POSTAL_MONEY_TRANSFER",
            },
          };
    const label = {
      recipient: {
        phone1: {
          number: order.phone,
        },
        clientName: `${order.firstName} ${order.lastName}`,
        privatePerson: true,
        address: order.validatedAddress,
        pickupOfficeId: order.office?.id,
      },
      service: {
        serviceId: 505, // Standard 24-hour Speedy service
        autoAdjustPickupDate: true,
        additionalServices: {
          ...cod,
          obpd: {
            option: "OPEN",
            returnShipmentServiceId: 505,
            returnShipmentPayer: "RECIPIENT",
          },
          returns: {
            swap: {
              serviceId: 505,
              parcelsCount: 1,
            },
          },
        },
      },
      content: {
        parcelsCount: 1,
        totalWeight: order.products.reduce((prevValue, currValue) => {
          return prevValue + currValue.orderedQuantity * currValue.weight;
        }, 0),
        contents: getContentsDescription(order),
        package: "BOX",
      },
      payment: {
        courierServicePayer: "SENDER",
        packagePayer: "RECIPIENT",
      },
    };
    const response = await this.createLabel(label);
    return response;
  }
}
