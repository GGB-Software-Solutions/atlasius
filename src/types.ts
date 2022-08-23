import { Company } from "./pages/Companies/types";

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
  createdAt: Date;
  createdBy: string; //TODO: Should this be a User object?
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
}

export interface Product extends Timestamps {
  id: number;
  sku: string;
  name: string;
  ean: string;
  weight: number;
  quantity: number;
  reserved: number;
  readyToDeliver: number; //TODO: What was this about
  // Item location in the warehouse
  itemLocation: string;
  warehouse: Warehouse; // TODO: Company already has assigned warehouse why not use it?
  company: Company;
  category: string;
}
