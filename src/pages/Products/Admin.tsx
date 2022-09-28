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
  const { company } = data;
  return [
    {
      ...data,
      companyId: company.id,
      createdBy: "6314d8f70e29a132b0262393", //TODO: Get user from the state
    },
  ];
};

const transform = (
  products: ProductResponse[] = [],
  companies: Company[]
): FormProduct[] =>
  products.map((product) => ({
    ...product,
    company: companies.find(
      (company) => company.id === product.productId.companyId
    ) as Company,
  }));

export default function Admin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Product, saveProduct);
  const { data, error, isLoading } = useSWR<ProductResponse[]>(
    API_ENDPOINTS.Product,
    jsonFetch
  );
  const companies = useStore((state) => state.companies);
  const handleSave = async (data: FormProduct) => trigger(map(data));
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
