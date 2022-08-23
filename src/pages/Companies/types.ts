import { Warehouse } from "../Warehouses/types";

export enum DeliveryCompany {
  Speedy,
  Econt,
}

export enum Ecommerce {
  Shopify,
}

interface DeliveryCompanyCredentials {
  deliveryCompanyId: DeliveryCompany;
  username: string;
  password: string;
}

interface EcommerceCredentials {
  eCommerce: Ecommerce;
  url: string;
  username: string;
  password: string;
}

export interface Company {
  id: number;
  name: string;
  responsiblePerson: string;
  vatNumber: string;
  phone: string;
  email: string;
  warehouses: Warehouse[];
  deliveryCompanyCredentials: DeliveryCompanyCredentials[];
  ecommerceCredentials: EcommerceCredentials[];
  // address1: string;
  // address2: string;
  // zipCode: string;
  // city: string;
  // country: string;
}
