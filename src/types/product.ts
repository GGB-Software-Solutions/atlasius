import { Company } from "../pages/Companies/types";

export interface ProductId {
  sku: string;
  companyId: string;
}

export interface ProductResponse {
  productId: ProductId;
  id: string;
  sku: string;
  name: string;
  category: string;
  ean: string;
  weight: number;
  orderedQuantity: number;
  itemLocation: string;
  quantity: number;
  reserved?: number;
  warehouseId: string;
}

export interface CollectProduct extends ProductResponse {
  pieces: number;
}

export interface FormProduct extends Omit<ProductResponse, "id"> {
  id: string;
  company: Company;
}

export interface ProductSubmit extends ProductResponse {
  companyId: string;
}
