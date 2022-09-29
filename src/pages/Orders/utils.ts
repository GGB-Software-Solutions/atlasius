import Econt from "../../econt";
import {
  ErrorStatus,
  MappedOrder,
  Order,
  OrderStatus,
  PaymentType,
  WarehouseStatus,
} from "../../types";
import {
  City,
  ClientProfile,
  Country,
  Office,
  ShipmentStatus,
  ShipmentType,
  ShippingLabel,
  ShippingLabelServices,
  Street,
} from "../../types/econt";
import { DeliveryCompany } from "../Companies/types";
import Fuse from "fuse.js";
import { findEcontCity, findEcontOffices } from "../../utils/econt";
import {
  SpeedyAddress,
  SpeedyCountry,
  SpeedyLabel,
  SpeedyOffice,
} from "../../types/speedy";
import {
  findSite,
  generateLabel,
  getStreets,
  validateAddress,
} from "../../speedy-api";
import { speedyCountries } from "../../speedy-countries";
import { Expedition } from "../../types/expedition";
import { CollectProduct } from "../../types/product";

export const mapProductsPieces = (data: MappedOrder[]): CollectProduct[] =>
  data.reduce<CollectProduct[]>((previousValue, currentValue) => {
    currentValue.products.forEach((product) => {
      const exists = previousValue.findIndex(
        (product1) => product1.id === product.id
      );
      if (exists === -1) {
        previousValue.push({ ...product, pieces: 1 });
      } else {
        previousValue[exists].pieces += 1;
      }
    });
    return previousValue;
  }, []);

export const getContentsDescription = (order: MappedOrder) => {
  const contents = order.products.map(
    (product) => product.category || product.name
  );
  const uniqueContents = [...new Set(contents)];
  return uniqueContents.join(",");
};

const econtService = new Econt(true);

export const generateShippingLabel = async (
  order: MappedOrder<DeliveryCompany.Econt>
) => {
  const profile = await econtService.getClientProfiles();
  const econtCredentials = order.company.deliveryCompanyCredentials.find(
    (credentials) => credentials.deliveryCompanyName === DeliveryCompany.Econt
  );
  console.log("Econt profile:", profile);

  const senderClient: ClientProfile = profile.client;
  const senderAgent = {
    name: econtCredentials?.senderAgent,
    // phones: ["0888166368"],
  };

  // Bokar manastirski livadi office
  const senderOfficeCode = "1137"; //TODO: Fix this?

  const receiverClient: ClientProfile = {
    name: `${order.firstName} ${order.lastName}`,
    phones: [order.phone],
  };
  const receiverOfficeCode = order.officeId;
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
            cdPayOptions: profile.cdPayOptions.find(
              (option) => option.num === econtCredentials?.agreementId
            ),
          },
        };

  // const instruction: Instruction = {
  //   id: "508047615",
  //   type: "return",
  //   returnInstructionParams: {
  //     returnParcelDestination: "sender",
  //     returnParcelPaymentSide: "receiver",
  //     rejectOriginalParcelPaySide: "sender",
  //     rejectReturnParcelPaySide: "sender",
  //   },
  // };

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
    // paymentReceiverMethod: "",
    // paymentReceiverAmount: "",
  };

  return econtService.createLabel(label);
};

export const generateSpeedyShippingLabel = async (
  order: MappedOrder<DeliveryCompany.Speedy>
) => {
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
      pickupOfficeId: order.officeId,
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
      totalWeight: 1, //TODO: Uncomment this
      // totalWeight: order.products.reduce((prevValue, currValue) => {
      //   return prevValue + currValue.orderedQuantity * currValue.weight;
      // }, 0),
      contents: getContentsDescription(order),
      package: "BOX",
    },
    payment: {
      courierServicePayer: "SENDER",
      packagePayer: "RECIPIENT",
    },
  };
  const response = await generateLabel(label);
  return response;
};

const options = (keys) => ({
  // isCaseSensitive: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys,
});

export const fuseSearch = (
  list: unknown[],
  pattern: string,
  keys: string[] = ["name", "nameEn"]
) => {
  const fuse = new Fuse(list, options(keys));
  return fuse.search(pattern);
};

const streetNumberRegex = new RegExp(
  /(\d+\s*[\p{General_Category=Letter}]*)$/u
);

export const extractStreetNumber = (address1: string) => {
  const result = address1.match(streetNumberRegex);
  if (result) {
    return result[0];
  }
  return "";
};

export const shouldOrderBeDeliveredToOffice = (order: MappedOrder) => {
  return (
    order.officeName === "СПИЙДИ ДО ОФИС" ||
    order.officeName === "ЕКОНТ ДО ОФИС"
  );
};

export const getDeliveryCourier = (order: MappedOrder) => {
  if (
    order.officeName === "СПИЙДИ ДО ОФИС" ||
    order.officeName === "СПИЙДИ ДО АДРЕС"
  )
    return DeliveryCompany.Speedy;
  if (
    order.officeName === "ЕКОНТ ДО ОФИС" ||
    order.officeName === "ЕКОНТ ДО АДРЕС"
  )
    return DeliveryCompany.Econt;
};

export const mapEcontOfficeDelivery = (
  order: Order,
  econtOffices: Office[]
): MappedOrder<DeliveryCompany.Econt> => {
  const mappedOrder: MappedOrder<DeliveryCompany.Econt> = { ...order };
  const offices = findEcontOffices(econtOffices, order.city).filter(
    (office) => !office.isAPS
  );

  if (order.officeId) {
    const office = offices.find((office) => office.code === order.officeId);
    if (office) {
      mappedOrder.office = office;
      mappedOrder.officeId = office.code;
    }
  } else {
    const results = fuseSearch(offices, order.address1, [
      "address.fullAddress",
      "address.fullAddressEn",
      "name",
      "nameEn",
    ]);
    const topResult = results[0];

    if (topResult) {
      const office = topResult.item as Office;
      mappedOrder.office = office;
      mappedOrder.officeId = office.code;
    } else {
      mappedOrder.errorStatus = ErrorStatus.WRONG_ADDRESS;
    }
  }

  return mappedOrder;
};

export const mapSpeedyOfficeDelivery = (
  order: Order,
  speedyOffices: SpeedyOffice[]
) => {
  const mappedOrder: MappedOrder<DeliveryCompany.Speedy> = { ...order };

  if (order.officeId) {
    const office = speedyOffices.find(
      (office) => office.id.toString() === order.officeId
    );
    if (office) {
      mappedOrder.office = office;
      mappedOrder.officeId = office.id.toString();
    }
  } else {
    const results = fuseSearch(speedyOffices, order.address1, [
      "address.localAddressString",
      "name",
      "nameEn",
    ]);
    const topResult = results[0];

    if (topResult) {
      const office = topResult.item as SpeedyOffice;
      mappedOrder.office = office;
      mappedOrder.officeId = office.id.toString();
    } else {
      mappedOrder.errorStatus = ErrorStatus.WRONG_ADDRESS;
    }
  }

  return mappedOrder;
};

export const mapSpeedyAddressDelivery = async (
  order: Order
): Promise<MappedOrder<DeliveryCompany.Speedy>> => {
  const countryId = (order.country as SpeedyCountry).id;
  const address: SpeedyAddress = {
    countryId,
    streetName: order.streetName,
    streetNo: order.streetNumber,
    siteName: order.city,
    postCode: order.zipCode,
  };
  const { valid } = await validateAddress(address);
  const mappedOrder: MappedOrder<DeliveryCompany.Speedy> = { ...order };

  const sites = await findSite({ countryId, name: order.city });

  if (sites.length > 0) {
    mappedOrder.city = sites[0];
    const streets = await getStreets({
      siteId: sites[0].id,
      name: order.streetName,
    });
    if (streets.length > 0) {
      mappedOrder.street = streets[0];
    }
  }

  if (valid) {
    mappedOrder.validatedAddress = address;
  } else {
    mappedOrder.errorStatus = ErrorStatus.WRONG_ADDRESS;
  }

  return mappedOrder;
};

export const mapEcontAddressDelivery = async (
  order: Order,
  econtCities: City[]
): Promise<MappedOrder<DeliveryCompany.Econt>> => {
  const econtService = new Econt(true);
  const city = findEcontCity(econtCities, order.city);
  const mappedOrder: MappedOrder<DeliveryCompany.Econt> = { ...order };
  if (city) {
    mappedOrder.city = city;

    const streets = await econtService.getStreets(city?.id);
    const results = fuseSearch(streets, order.address1);
    const topResult = results[0].item;

    if (topResult) {
      const street = topResult as Street;
      mappedOrder.street = street;
      mappedOrder.streetName = street.name;
      const { address } = await econtService.validateAddress(
        city.name as string,
        mappedOrder.street.name,
        mappedOrder.streetNumber,
        mappedOrder.zipCode
      );

      if (address) {
        mappedOrder.validatedAddress = address;
      } else {
        mappedOrder.errorStatus = ErrorStatus.WRONG_ADDRESS;
      }
    }
  }
  return mappedOrder;
};

export const getOrderDialogTitle = (order: MappedOrder) => {
  if (order.status === OrderStatus.NEW) {
    if (order.warehouseStatus === WarehouseStatus.PICKING) {
      return "Събери стока";
    }
    if (order.warehouseStatus === WarehouseStatus.PACKING) {
      return "Пакетирай стока";
    }
  }
};

export const getOrderCountry = (order: Order, econtCountries: Country[]) => {
  const deliveryCourier = getDeliveryCourier(order);
  let country: MappedOrder["country"] = order.country;
  if (
    deliveryCourier === DeliveryCompany.Econt &&
    typeof country === "string"
  ) {
    country = econtCountries.find(
      (ecountCountry) =>
        ecountCountry.name?.toLowerCase() === country.toLowerCase() ||
        ecountCountry.nameEn.toLowerCase() === country.toLowerCase()
    );
  }
  if (
    deliveryCourier === DeliveryCompany.Speedy &&
    typeof country === "string"
  ) {
    country = speedyCountries.find(
      (speedyCountry) =>
        speedyCountry.name.toLowerCase() === country.toLowerCase() ||
        speedyCountry.nameEn.toLowerCase() === country.toLowerCase()
    );
  }
  return country;
};

// СПИЙДИ ДО АДРЕС, СПИЙДИ ДО ОФИС, ЕКОНТ ДО АДРЕС, ЕКОНТ ДО ОФИС, Не е избрано нищо(до адрес)
// - ЕКОНТ ДО ОФИС
//      - УСПЕШНО - мапваме офиса в ново поле office, не е нужно да мапваме града и улицата ако е до офис
//      - НЕУСПЕШНО - office=null,може даже да скрием city autocomplete-a,а просто показваме всички офиси, не е нужно да мапваме града и улицата ако е до офис
// - ЕКОНТ ДО АДРЕС
//      - УСПЕШНО - мапваме град, улица, и номер на улица, също може да добавим поле isValidAddress
//      - НЕУСПЕШНО - мапваме което успеем(град, улица), номер на улица, isValidAddress=false
export const mapOrders = async (
  orders: Order[] = [],
  econtOffices: Office[],
  speedyOffices: SpeedyOffice[],
  econtCities: City[],
  econtCountries: Country[]
): Promise<MappedOrder<DeliveryCompany.Speedy | DeliveryCompany.Econt>[]> => {
  const data = await Promise.all(
    orders.map(async (order) => {
      order.streetNumber =
        order.streetNumber || extractStreetNumber(order.address1);
      order.country = getOrderCountry(order, econtCountries);

      if (order.officeName === "ЕКОНТ ДО ОФИС") {
        return mapEcontOfficeDelivery(order, econtOffices);
      }

      if (order.officeName === "СПИЙДИ ДО ОФИС") {
        return mapSpeedyOfficeDelivery(order, speedyOffices);
      }

      if (order.officeName === "ЕКОНТ ДО АДРЕС") {
        return mapEcontAddressDelivery(order, econtCities);
      }

      if (order.officeName === "СПИЙДИ ДО АДРЕС") {
        return mapSpeedyAddressDelivery(order);
      }
      return order;
    })
  );
  return data;
};

export const mapSpeedyLabelToExpedition = (
  label: SpeedyLabel,
  order: MappedOrder<DeliveryCompany.Speedy>
) => {
  const expedition: Expedition = {
    shipmentId: label.id,
    companyId: order.company.id,
    orderId: order.id,
    deliveryCompany: DeliveryCompany.Speedy,
    deliveryPrice: label.price.total,
    // status: //TODO:
  };
  return expedition;
};

export const mapEcontLabelToExpedition = (
  label: ShipmentStatus,
  order: MappedOrder<DeliveryCompany.Econt>
) => {
  const expedition: Expedition = {
    shipmentId: label.shipmentNumber,
    companyId: order.company.id,
    orderId: order.id,
    deliveryCompany: DeliveryCompany.Econt,
    deliveryPrice: label.totalPrice,
    // status: //TODO:
  };
  return expedition;
};
