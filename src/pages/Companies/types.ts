import { Warehouse } from "../../types";

export enum DeliveryCompany {
  Speedy = "SPEEDY",
  Econt = "ECONT",
}

export enum Ecommerce {
  Shopify = "SHOPIFY",
}

interface DeliveryCompanyCredentials {
  deliveryCompanyName: string;
  username: string;
  password: string;
}

interface EcommerceCredentials {
  name: Ecommerce;
  url: string;
  username: string;
  password: string;
}

export interface Company {
  id: string;
  name: string;
  responsiblePerson: string;
  vatNumber: string;
  phone: string;
  email: string;
  warehouse: Warehouse[];
  deliveryCompanyCredentials: DeliveryCompanyCredentials[];
  ecommerceCredentials: EcommerceCredentials[];
  // address1: string;
  // address2: string;
  // zipCode: string;
  // city: string;
  // country: string;
}
