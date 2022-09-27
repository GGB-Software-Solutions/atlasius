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
  agreementId?: string; // Agreement id valid only for Econt
  senderAgent?: string; // Sender agent valid only for Econt
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
