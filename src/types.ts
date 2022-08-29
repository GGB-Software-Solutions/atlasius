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

export interface BaseProduct extends Timestamps {
  id: number;
  sku: string;
  name: string;
  ean: string;
  weight: number;
  category: string;
}

export interface WarehouseProductQuantity {
  id: number;
  product: BaseProduct;
  company: Company;
  warehouse: Warehouse;
  quantity: number;
  reserved: number;
  readyToDeliver: number; //TODO: What was this about
  // Item location in the warehouse
  itemLocation: string;
}

export interface Product extends BaseProduct {
  quantities: WarehouseProductQuantity[];
}

export interface FormProduct extends Product {
  company: Company;
}
