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
import {
  updateOrderStatus,
  UpdateOrderStatus,
  updateShippingDetails,
} from "./api";
import useProcessRowUpdate from "./useProcessRowUpdate";
import UpdatePhoneDialog from "./UpdatePhoneDialog";
import { useConfirm } from "material-ui-confirm";

export default function Admin() {
  const confirm = useConfirm();
  const { processRowUpdate, onClose, promiseArguments, onError, onSuccess } =
    useProcessRowUpdate();
  const econtOffices = useStore((state) => state.econtOffices);
  const econtCountries = useStore((state) => state.econtCountries);
  const econtCities = useStore((state) => state.econtCities);
  const speedyOffices = useStore((state) => state.speedyOffices);
  const setNotification = useStore((state) => state.setNotification);
  const selectedCompany = useStore((state) => state.selectedCompany);
  const [mappedRows, setMappedRows] = React.useState<MappedOrder[]>([]);
  const {
    data = [],
    isLoading: isLoadingData,
    mutate,
  } = useSWR(selectedCompany ? API_ENDPOINTS.Order : null, jsonFetch);
  const [open, setOpen] = React.useState(false);
  const [openUpdateOrderDialog, setOpenUpdateOrderDialog] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<MappedOrder[]>([]);

  React.useEffect(() => {
    if (!selectedCompany)
      setNotification({ type: "warning", message: "Няма избрана компания." });
  }, [selectedCompany]);

  const handleCollectGoods = async (data: MappedOrder[]) => {
    await changeStatus(data, OrderStatus.RESERVED);
    setOpen(true);
    setSelectedRows(data);
  };

  const handleDialogClose = async () => {
    await changeStatus(selectedRows, OrderStatus.NEW);
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

  const handleSavePhoneNumber = async () => {
    const { newRow } = promiseArguments;

    const response = await updateShippingDetails({
      id: newRow.id,
      phone: newRow.phone,
    });
    if (response.success) {
      setNotification({ type: "success", message: response.success });
      onSuccess(newRow);
    } else {
      setNotification({ type: "error", message: response.error });
      onError();
    }
  };

  const handleReturnOrderForPreparationClick = async (data: MappedOrder[]) => {
    await changeStatus(data, OrderStatus.NEW);
  };

  const handleCancelOrder = async (data: MappedOrder[]) => {
    confirm({
      title: "Сигурни ли сте,че искате да анулирате избраните поръчки?",
      confirmationText: "Да",
      cancellationText: "Затвори",
    }).then(() => {
      changeStatus(data, OrderStatus.CANCELLED);
      mutate();
    });
  };

  const changeStatus = async (data: MappedOrder[], status: OrderStatus) => {
    const orderStatuses: UpdateOrderStatus[] = data.map((order) => ({
      id: order.id,
      status,
    }));
    await updateOrderStatus(orderStatuses);
  };

  const mapRows = async () => {
    setIsLoading(true);
    console.time();
    const rows = await mapOrders(
      data,
      econtOffices,
      speedyOffices,
      econtCities,
      econtCountries
    );
    console.timeEnd();
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
          onReturnForPreparation={handleReturnOrderForPreparationClick}
          processRowUpdate={processRowUpdate}
          onCancelOrder={handleCancelOrder}
        />
        <CollectGoodsDialog
          orders={selectedRows}
          setOrders={setSelectedRows}
          open={open}
          onClose={handleDialogClose}
        />
        <UpdateOrderDialog
          orders={selectedRows}
          open={openUpdateOrderDialog}
          onClose={handleUpdateOrderDialogClose}
          onSave={mutate}
        />
        <UpdatePhoneDialog
          promiseArguments={promiseArguments}
          onClose={onClose}
          onSave={handleSavePhoneNumber}
        />
      </PageContainer>
    </>
  );
}
