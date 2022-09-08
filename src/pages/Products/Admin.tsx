import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import ProductDialog from "./Dialog";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";
import useStore from "../../store/globalStore";
import { Company } from "../Companies/types";
import {
  FormProduct,
  ProductResponse,
  ProductSubmit,
} from "../../types/product";

async function saveProduct(url: string, options) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

const map = (data: FormProduct): ProductSubmit[] => {
  const {
    sku,
    name,
    ean,
    weight,
    category,
    company,
    productWarehouseQuantities,
  } = data;
  return [
    {
      sku,
      name,
      weight,
      category,
      ean,
      companyId: company.id,
      createdBy: "6314d8f70e29a132b0262393", //TODO: Get user from the state
      productWarehouseQuantities,
    },
  ];
};

const transform = (
  products: ProductResponse[] = [],
  companies: Company[]
): FormProduct[] =>
  products.map((product) => ({
    ...product,
    id: `${product.id.companyId}${product.id.sku}`,
    company: companies.find(
      (company) => company.id === product.id.companyId
    ) as Company,
  }));

export default function Admin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Product, saveProduct);
  const { data, error, isLoading } = useSWR<ProductResponse[]>(
    API_ENDPOINTS.Product,
    jsonFetch
  );
  const companies = useStore((state) => state.companies);

  const handleSave = (data: FormProduct) => {
    trigger(map(data));
  };
  const rows = transform(data || [], companies);

  return (
    <PageContainer title="Продукти">
      <Table
        loading={isLoading}
        error={error}
        rows={rows}
        Editor={ProductDialog}
        onEditorSave={handleSave}
      />
    </PageContainer>
  );
}
