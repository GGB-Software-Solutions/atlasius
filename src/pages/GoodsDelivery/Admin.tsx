import React from "react";
import PageContainer from "../../components/PageContainer";
import Table, { DeliveredProduct } from "./Table";
import DeliveredProductsSubmitDialog from "./Dialog";
import { FormData } from "./Form";

export default function Admin() {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<DeliveredProduct[]>([]);

  const submitForDelivery = (products: DeliveredProduct[]) => {
    setProducts(products);
    setOpen(!open);
  };

  const handleSave = (data: FormData) => {
    // TODO: Implement submit for delivered products
    console.log(data, products);
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
