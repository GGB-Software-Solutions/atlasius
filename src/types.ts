import { Company, DeliveryCompany } from "./pages/Companies/types";
import { Address, City, Country, Office, Street } from "./types/econt";
import { Expedition } from "./types/expedition";
import { ProductResponse } from "./types/product";
import {
  SpeedyAddress,
  SpeedyCity,
  SpeedyCountry,
  SpeedyOffice,
} from "./types/speedy";

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

export interface Warehouse {
  id: number;
  name: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
}

interface Timestamps {
  createdAt: string;
  createdBy: string; //TODO: Should this be a User object?
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  VOUCHER = "VOUCHER",
}

export enum OrderStatus {
  NEW = "NEW",
  RESERVED = "RESERVED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
}

export enum WarehouseStatus {
  PICKING = "PICKING",
  PACKING = "PACKING",
  SHIPPING = "SHIPPING",
}

export enum FulfillmentStatus {
  //Is either picked or packed
  UNFULFILLED = "UNFULFILLED",
  //Order has been picked and packed and on it's way to customer
  FULFILLED = "FULFILLED",
}

export enum ErrorStatus {
  NOT_ENOUGH_QUANTITY = "NOT_ENOUGH_QUANTITY",
  MISSING_PRODUCT = "MISSING_PRODUCT",
  WRONG_ADDRESS = "WRONG_ADDRESS",
  MISSING_WRONG_PHONE = "MISSING_WRONG_PHONE",
}

export interface OrderShippingDetails
  extends Pick<
    Order,
    | "address1"
    | "address2"
    | "city"
    | "zipCode"
    | "country"
    | "streetName"
    | "streetNumber"
  > {}

type OfficeName =
  | "СПИЙДИ ДО ОФИС"
  | "СПИЙДИ ДО АДРЕС"
  | "ЕКОНТ ДО ОФИС"
  | "ЕКОНТ ДО АДРЕС";

export type DeliveryProvider = OfficeName & ("econt" | "speedy");

export interface Order {
  id: string;
  products: ProductResponse[];
  externalId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetName: string;
  streetNumber: string;
  address1: string;
  city: string;
  zipCode: string;
  province: string;
  country: string;
  address2: string;
  company: Company;
  countryCode: string;
  provinceCode: string;
  deliveryProvider: DeliveryProvider;
  officeId: string;
  officeName: OfficeName;
  customerNote: string;
  paymentType: PaymentType;
  price: number;
  deliveryPrice: number;
  status: OrderStatus;
  warehouseStatus: WarehouseStatus;
  fulfillmentStatus: FulfillmentStatus;
  errorStatus: ErrorStatus;
}

export interface MappedOrder<T extends DeliveryCompany = any>
  extends Omit<Order, "city" | "country"> {
  country: T extends DeliveryCompany.Econt ? Country : SpeedyCountry;
  city: string | (T extends DeliveryCompany.Econt ? City : SpeedyCity);
  office?: T extends DeliveryCompany.Econt ? Office : SpeedyOffice;
  street?: Street; //TODO: Add speedy address type as well;
  validatedAddress?: T extends DeliveryCompany.Econt ? Address : SpeedyAddress;
  shippingLabel?: Expedition;
}
