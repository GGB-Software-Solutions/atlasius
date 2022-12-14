import {
  DeliveryCompany,
  DeliveryCompanyCredentials,
} from "./pages/Companies/types";
import {
  getContentsDescription,
  shouldOrderBeDeliveredToOffice,
} from "./pages/Orders/utils";
import { MappedOrder, PaymentType } from "./types";
import {
  SpeedyAddress,
  SpeedyCountry,
  SpeedyError,
  SpeedyLabel,
} from "./types/speedy";
import { getDeliveryPriceAndPayer } from "./utils/common";

const BASE_URL = "https://api.speedy.bg/v1";
const IS_PROD = process.env.NODE_ENV === "production";
const IS_TEST_API_MODE = process.env.NEXT_PUBLIC_SPEEDY_API_MODE === "test";
export const BULGARIA_COUNTRY_ID = 100;
const SPEEDY_TEST_USERNAME = process.env.NEXT_PUBLIC_SPEEDY_TEST_USERNAME;
const SPEEDY_TEST_PASSWORD = process.env.NEXT_PUBLIC_SPEEDY_TEST_PASSWORD;

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

  async findSite({ countryId, name = "" }: FindSiteProps) {
    const params = new URLSearchParams({
      countryId,
      name,
      ...this.credentials,
    });
    const response = await fetch("api/speedy/sites?" + params);
    const data = await response.json();
    return data;
  }

  async getOffices(countryId: number) {
    const params = new URLSearchParams({ countryId, ...this.credentials });
    const response = await fetch("api/speedy/sites?" + params);
    const data = await response.json();
    return data;
  }

  async getStreets({ siteId, name = "" }: FindStreetsProps) {
    const params = new URLSearchParams({ siteId, name, ...this.credentials });
    const response = await fetch("api/speedy/streets?" + params);
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
      paperSize: "A6",
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
    const speedyCredentials = order.company.deliveryCompanyCredentials.find(
      (credentials) =>
        credentials.deliveryCompanyName === DeliveryCompany.Speedy
    );
    const { orderPrice, courierServicePayer } = getDeliveryPriceAndPayer(
      speedyCredentials,
      order.price,
      shouldOrderBeDeliveredToOffice(order)
    );

    //Options before payment
    const obpd =
      speedyCredentials?.payAfterAccept || speedyCredentials?.payAfterTest
        ? {
            option: speedyCredentials.payAfterTest ? "TEST" : "OPEN",
            returnShipmentServiceId: 505,
            returnShipmentPayer: "RECIPIENT",
          }
        : {};

    const cod =
      order.paymentType === PaymentType.CARD
        ? {}
        : {
            cod: {
              amount: orderPrice,
              payoutToLoggedClient: true,
              includeShippingPrice: false,
              processingType: "POSTAL_MONEY_TRANSFER",
            },
          };
    const label = {
      recipient: {
        phone1: {
          number: order.phone.replaceAll(" ", ""),
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
          obpd,
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
        //If payment was made by card the courier service is always paid by the recipient
        courierServicePayer:
          order.paymentType === PaymentType.CARD
            ? "RECIPIENT"
            : courierServicePayer,
        packagePayer: "RECIPIENT",
      },
    };
    const response = await this.createLabel(label);
    return response;
  }
}
