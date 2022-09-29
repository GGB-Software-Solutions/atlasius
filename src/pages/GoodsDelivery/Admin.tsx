import React from "react";
import PageContainer from "../../components/PageContainer";
import Table, { DeliveredProduct } from "./Table";
import DeliveredProductsSubmitDialog from "./Dialog";
import { FormData } from "./Form";
import { API_ENDPOINTS } from "../../api";
import { jsonFetch } from "../../utils/fetch";
import useSWRMutation from "swr/mutation";

const map = (products: DeliveredProduct[], data: FormData) => {
  return products.map((product) => {
    return {
      sku: product.Ean,
      name: product["Product name"],
      weight: product.ml,
      category: product.Type,
      ean: product.Ean,
      companyId: data.company?.id,
      createdBy: "6314d8f70e29a132b0262393", //TODO:
      productWarehouseQuantities: [
        {
          itemLocation: data.itemLocation,
          quantity: product["Общо Бройка"],
          warehouseId: data.warehouse?.id,
        },
      ],
    };
  });
};

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "PUT", body: JSON.stringify(options.arg) });
}

export default function Admin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Product, sendRequest);
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<DeliveredProduct[]>([]);

  const submitForDelivery = (products: DeliveredProduct[]) => {
    setProducts(products);
    setOpen(!open);
  };

  const handleSave = (data: FormData) => {
    trigger(map(products, data));
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <PageContainer title="Стока за заприхождаване">
        <Table onSubmitForDelivery={submitForDelivery} />
      </PageContainer>
      <DeliveredProductsSubmitDialog
        onSave={handleSave}
        onClose={handleClose}
        open={open}
        title="Заприхождаване на продукти"
      />
    </>
  );
}
