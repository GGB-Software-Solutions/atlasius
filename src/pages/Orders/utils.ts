import Econt from "../../econt";
import {
  ErrorStatus,
  MappedOrder,
  Order,
  OrderStatus,
  DeliveryProvider,
  WarehouseStatus,
} from "../../types";
import {
  City,
  Country,
  Office,
  ShipmentStatus,
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
import { Speedy } from "../../speedy-api";
import { speedyCountries } from "../../speedy-countries";
import { Expedition } from "../../types/expedition";
import { CollectProduct } from "../../types/product";
import { getDeliveryCompanyCredentials } from "../../utils/common";

//If there is a promotion it will pull the products from the promotion and add it to the order products array
const getOrderProducts = (order: MappedOrder) => {
  return order.products
    .map((product) => {
      if (product.promotions && product.promotions.length > 0) {
        const promotionProducts = product.promotions.map(
          (promotionProduct) => promotionProduct.product
        );
        return promotionProducts;
      }
      return product;
    })
    .flat();
};

export const mapProductsPieces = (data: MappedOrder[]): CollectProduct[] => {
  const orders = data.map((order) => {
    const products = getOrderProducts(order);
    return {
      ...order,
      products,
    };
  });

  return orders.reduce<CollectProduct[]>((previousValue, currentValue) => {
    currentValue.products.forEach((product) => {
      const exists = previousValue.findIndex(
        (product1) => product1.id === product.id
      );
      if (exists === -1) {
        previousValue.push({
          ...product,
          orderedQuantity: product.orderedQuantity,
        });
      } else {
        previousValue[exists].orderedQuantity += product.orderedQuantity;
      }
    });
    return previousValue;
  }, []);
};

export const getContentsDescription = (order: MappedOrder) => {
  const contents = order.products.map(
    (product) => product.category || product.name
  );
  const uniqueContents = [...new Set(contents)];
  return uniqueContents.join(",");
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

export const extractStreetNumber = (address1: string = "") => {
  const result = address1.match(streetNumberRegex);
  if (result) {
    return result[0];
  }
  return "";
};

export const shouldOrderBeDeliveredToOffice = (order: MappedOrder) => {
  return (
    order.deliveryProvider === "СПИЙДИ ДО ОФИС" ||
    order.deliveryProvider === "ЕКОНТ ДО ОФИС" ||
    order.officeId ||
    order.officeName
  );
};

export const getDeliveryCourier = (order: Order | MappedOrder) => {
  if (
    order.deliveryProvider === "СПИЙДИ ДО ОФИС" ||
    order.deliveryProvider === "СПИЙДИ ДО АДРЕС" ||
    order.deliveryProvider.toLowerCase() === "speedy"
  )
    return DeliveryCompany.Speedy;
  if (
    order.deliveryProvider === "ЕКОНТ ДО ОФИС" ||
    order.deliveryProvider === "ЕКОНТ ДО АДРЕС" ||
    order.deliveryProvider.toLowerCase() === "econt"
  )
    return DeliveryCompany.Econt;
};

export const mapEcontOfficeDelivery = (
  order: MappedOrder<DeliveryCompany.Econt>,
  econtOffices: Office[]
): MappedOrder<DeliveryCompany.Econt> => {
  const mappedOrder: MappedOrder<DeliveryCompany.Econt> = { ...order };
  const offices = findEcontOffices(econtOffices, order.city as string).filter(
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
  order: MappedOrder<DeliveryCompany.Speedy>,
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
  order: MappedOrder<DeliveryCompany.Speedy>
): Promise<MappedOrder<DeliveryCompany.Speedy>> => {
  const countryId = order.country.id;
  const credentials = getDeliveryCompanyCredentials(
    order.company,
    DeliveryCompany.Speedy
  );
  const mappedOrder: MappedOrder<DeliveryCompany.Speedy> = { ...order };
  let valid;

  if (credentials) {
    const speedyService = new Speedy(credentials);
    const address: SpeedyAddress = {
      countryId,
      streetName: order.streetName,
      streetNo: order.streetNumber,
      siteName: order.city as string,
      postCode: order.zipCode,
    };
    const { valid: isAddressValid, error } =
      await speedyService.validateAddress(address);
    valid = isAddressValid;

    const sites = await speedyService.findSite({
      countryId,
      name: order.city as string,
    });
    if (sites.length > 0) {
      mappedOrder.city = sites[0];
      const streets = await speedyService.getStreets({
        siteId: sites[0].id,
        name: order.streetName,
      });
      if (streets.length > 0) {
        mappedOrder.street = streets[0];
      }
    }

    if (valid) {
      mappedOrder.validatedAddress = address;
    }
  }

  if (!valid) {
    mappedOrder.errorStatus = ErrorStatus.WRONG_ADDRESS;
  }

  return mappedOrder;
};

export const mapEcontAddressDelivery = async (
  order: MappedOrder<DeliveryCompany.Econt>,
  econtCities: City[]
): Promise<MappedOrder<DeliveryCompany.Econt>> => {
  const city = findEcontCity(econtCities, order.city as string);
  const mappedOrder: MappedOrder<DeliveryCompany.Econt> = { ...order };
  const credentials = getDeliveryCompanyCredentials(
    mappedOrder.company,
    DeliveryCompany.Econt
  );
  if (city && credentials) {
    mappedOrder.city = city;
    const econtService = new Econt(credentials);
    const streets = await econtService.getStreets(city.id);
    const results = fuseSearch(streets, order.address1);
    const topResult = results[0]?.item;

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

export const getOrderCountry = (
  order: Order,
  econtCountries: Country[]
): Country | SpeedyCountry | undefined => {
  const deliveryCourier = getDeliveryCourier(order);
  let country = undefined;
  if (
    deliveryCourier === DeliveryCompany.Econt &&
    typeof order.country === "string"
  ) {
    country = econtCountries.find(
      (ecountCountry) =>
        ecountCountry.name?.toLowerCase() === order.country.toLowerCase() ||
        ecountCountry.nameEn?.toLowerCase() === order.country.toLowerCase()
    );
  }
  if (
    deliveryCourier === DeliveryCompany.Speedy &&
    typeof order.country === "string"
  ) {
    country = speedyCountries.find(
      (speedyCountry) =>
        speedyCountry.name.toLowerCase() === order.country.toLowerCase() ||
        speedyCountry.nameEn.toLowerCase() === order.country.toLowerCase()
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
      let mappedOrder: MappedOrder = {
        ...order,
        streetNumber: order.streetNumber || extractStreetNumber(order.address1),
        country: getOrderCountry(order, econtCountries) as
          | Country
          | SpeedyCountry,
      };

      //If the order has error or cancelled we return early not to try to validate the address
      if (order.errorStatus || order.status === OrderStatus.CANCELLED) {
        return mappedOrder;
      }

      if (mappedOrder.deliveryProvider === "econt") {
        if (mappedOrder.officeId) {
          mappedOrder = mapEcontOfficeDelivery(mappedOrder, econtOffices);
        } else {
          mappedOrder = await mapEcontAddressDelivery(mappedOrder, econtCities);
        }
      }

      if (mappedOrder.deliveryProvider === "ЕКОНТ ДО ОФИС") {
        mappedOrder = mapEcontOfficeDelivery(mappedOrder, econtOffices);
      }

      if (mappedOrder.deliveryProvider === "ЕКОНТ ДО АДРЕС") {
        mappedOrder = await mapEcontAddressDelivery(mappedOrder, econtCities);
      }

      if (mappedOrder.deliveryProvider === "speedy") {
        if (mappedOrder.officeId) {
          mappedOrder = mapSpeedyOfficeDelivery(mappedOrder, speedyOffices);
        } else {
          mappedOrder = await mapSpeedyAddressDelivery(mappedOrder);
        }
      }

      if (mappedOrder.deliveryProvider === "СПИЙДИ ДО ОФИС") {
        mappedOrder = mapSpeedyOfficeDelivery(mappedOrder, speedyOffices);
      }

      if (mappedOrder.deliveryProvider === "СПИЙДИ ДО АДРЕС") {
        mappedOrder = await mapSpeedyAddressDelivery(mappedOrder);
      }
      return mappedOrder;
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
    pdfUrl: label.pdfURL,
    // status: //TODO:
  };
  return expedition;
};
