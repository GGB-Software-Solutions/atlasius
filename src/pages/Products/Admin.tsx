import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import ProductDialog from "./Dialog";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";
import { FormProduct, Product } from "../../types";
import { products as mocks } from "../../mocks/mocks";

async function saveProduct(url: string, options) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

const transform = (products: Product[] = mocks): FormProduct[] =>
  products.map((product) => ({
    ...product,
    company: product.quantities[0].company,
  }));

export default function Admin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Product, saveProduct);
  const { data, error, isLoading } = useSWR<Product[]>(
    API_ENDPOINTS.Product,
    jsonFetch
  );

  return (
    <PageContainer title="Продукти">
      <Table
        rows={transform(data)}
        Editor={ProductDialog}
        onEditorSave={trigger}
      />
    </PageContainer>
  );
}
