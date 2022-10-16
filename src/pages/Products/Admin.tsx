import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import ProductDialog from "./Dialog";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";
import useStore from "../../store/globalStore";
import {
  FormProduct,
  ProductResponse,
  ProductSubmit,
} from "../../types/product";

async function saveProduct(url: string, options: Record<string, unknown>) {
  const product = options.arg[0];
  const productBody = product.productWarehouseQuantities.map((entry) => ({
    ...product,
    ...entry,
  }));
  return jsonFetch(url, { method: "POST", body: JSON.stringify(productBody) });
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

const mapProducts = (products) =>
  products.reduce((p, c) => {
    const key = c.productId.sku + c.productId.companyId;
    if (p.has(key)) {
      const product = p.get(key);
      product.productWarehouseQuantities =
        product.productWarehouseQuantities || [];
      product.productWarehouseQuantities.push({
        quantity: c.quantity,
        itemLocation: c.itemLocation,
        reserved: c.reserved,
        warehouseId: c.warehouseId,
      });

      p.set(key, product);
    } else {
      c.productWarehouseQuantities = [
        {
          quantity: c.quantity,
          itemLocation: c.itemLocation,
          reserved: c.reserved,
          warehouseId: c.warehouseId,
        },
      ];
      p.set(key, c);
    }
    return p;
  }, new Map());

export default function Admin() {
  const selectedCompany = useStore((state) => state.selectedCompany);
  const setNotification = useStore((state) => state.setNotification);
  const { trigger } = useSWRMutation(API_ENDPOINTS.Product, saveProduct);
  const {
    data = [],
    error,
    isLoading,
  } = useSWR<ProductResponse[]>(
    selectedCompany ? API_ENDPOINTS.Product : null,
    jsonFetch
  );

  React.useEffect(() => {
    if (!selectedCompany)
      setNotification({ type: "warning", message: "Няма избрана компания." });
  }, [selectedCompany]);

  const handleSave = async (data: FormProduct) => trigger(map(data));

  const rows = React.useMemo(
    () => Array.from(mapProducts(data).values()),
    [data]
  );

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
