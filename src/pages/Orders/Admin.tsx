import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import CollectGoodsDialog from "./Dialog";
import { MappedOrder, OrderStatus } from "../../types";
import useStore from "../../store/globalStore";
import { mapOrders } from "./utils";
import useSWR from "swr";
import { API_ENDPOINTS } from "../../api";
import { jsonFetch } from "../../utils/fetch";
import UpdateOrderDialog from "./UpdateOrderDialog";
import { updateOrderStatus, UpdateOrderStatus } from "./api";

export default function Admin() {
  const econtOffices = useStore((state) => state.econtOffices);
  const econtCountries = useStore((state) => state.econtCountries);
  const econtCities = useStore((state) => state.econtCities);
  const speedyOffices = useStore((state) => state.speedyOffices);
  const [mappedRows, setMappedRows] = React.useState<MappedOrder[]>([]);
  const {
    data = [],
    isLoading: isLoadingData,
    mutate,
  } = useSWR(API_ENDPOINTS.Order, jsonFetch);
  const [open, setOpen] = React.useState(false);
  const [openUpdateOrderDialog, setOpenUpdateOrderDialog] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<MappedOrder[]>([]);
  const handleCollectGoods = async (data: MappedOrder[]) => {
    await changeStatus(data, OrderStatus.RESERVED);
    setOpen(true);
    setSelectedRows(data);
  };

  const handleDialogClose = async (shouldChangeStatus = true) => {
    //When finishing the order we should not change the status
    if (shouldChangeStatus) {
      await changeStatus(selectedRows, OrderStatus.NEW);
    }
    mutate();
    setOpen(false);
    setSelectedRows([]);
  };

  const handleUpdateOrderClick = (data: MappedOrder[]) => {
    setOpenUpdateOrderDialog(true);
    setSelectedRows(data);
  };

  const handleUpdateOrderDialogClose = () => {
    setOpenUpdateOrderDialog(false);
    setSelectedRows([]);
  };

  const changeStatus = async (data: MappedOrder[], status: OrderStatus) => {
    await Promise.all(
      data.map((order) => {
        const orderStatus: UpdateOrderStatus = {
          id: order.id,
          status,
        };
        return updateOrderStatus(orderStatus);
      })
    );
  };

  const mapRows = async () => {
    setIsLoading(true);
    const rows = await mapOrders(
      data,
      econtOffices,
      speedyOffices,
      econtCities,
      econtCountries
    );
    setMappedRows(rows);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (
      !isLoadingData &&
      Boolean(data.length) &&
      Boolean(econtOffices.length) &&
      Boolean(speedyOffices.length) &&
      Boolean(econtCities.length) &&
      Boolean(econtCountries.length)
    ) {
      mapRows();
    }
  }, [
    data,
    econtOffices,
    speedyOffices,
    econtCities,
    econtCountries,
    isLoadingData,
  ]);

  return (
    <>
      <PageContainer title="Поръчки">
        <Table
          loading={isLoading || isLoadingData}
          rows={mappedRows || []}
          onCollectGoods={handleCollectGoods}
          onUpdateOrder={handleUpdateOrderClick}
        />
        <CollectGoodsDialog
          orders={selectedRows}
          open={open}
          onClose={handleDialogClose}
        />
        <UpdateOrderDialog
          orders={selectedRows}
          open={openUpdateOrderDialog}
          onClose={handleUpdateOrderDialogClose}
          onSave={mutate}
        />
      </PageContainer>
    </>
  );
}
