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
import {
  GridFilterItem,
  GridFilterModel,
  GridSortItem,
  GridSortModel,
} from "@mui/x-data-grid";
import { mapFilters } from "../../components/Table/utils";

const mapStatusFilter = (filters: GridFilterItem[]) => {
  const statusFilter = filters.find(
    (filter) => filter.columnField === "status"
  );
  const newFilters = filters.filter(
    (filter) => filter.columnField !== "status"
  );
  const statusFilters = statusFilter?.value
    ? Object.keys(statusFilter?.value).map((key) => ({
        columnField: key,
        value: statusFilter?.value[key],
        operatorValue: statusFilter?.value[key] === null ? "isnull" : "equals",
      }))
    : [];
  newFilters.push(...statusFilters);
  return newFilters;
};

export default function Admin() {
  const selectedCompany = useStore((state) => state.selectedCompany);
  const initialCompanyFilter = selectedCompany
    ? [
        {
          columnField: "company.id",
          operatorValue: "equals",
          value: selectedCompany.id,
        },
        {
          columnField: "status",
          operatorValue: "not",
          value: "ARCHIVED",
        },
      ]
    : [];

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [sorting, setSorting] = React.useState<GridSortItem>();
  const [filters, setFilters] = React.useState<GridFilterItem[]>([]);
  const confirm = useConfirm();
  const { processRowUpdate, onClose, promiseArguments, onError, onSuccess } =
    useProcessRowUpdate();
  const econtOffices = useStore((state) => state.econtOffices);
  const econtCountries = useStore((state) => state.econtCountries);
  const econtCities = useStore((state) => state.econtCities);
  const speedyOffices = useStore((state) => state.speedyOffices);
  const setNotification = useStore((state) => state.setNotification);
  const [mappedRows, setMappedRows] = React.useState<MappedOrder[]>([]);
  const params = {
    page,
    size: pageSize,
    sort: sorting ? `${sorting?.field},${sorting?.sort}` : "",
    filterAnd: mapFilters([
      ...initialCompanyFilter,
      ...mapStatusFilter([...filters]),
    ]),
  };
  const {
    data = {},
    isLoading: isLoadingData,
    mutate,
  } = useSWR(
    selectedCompany
      ? `${API_ENDPOINTS.Order}?${new URLSearchParams(params)}`
      : null,
    jsonFetch,
    { revalidateOnFocus: false }
  );

  const { totalElements, content } = data;

  const [rowCountState, setRowCountState] = React.useState(totalElements || 0);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      totalElements !== undefined ? totalElements : prevRowCountState
    );
  }, [totalElements, setRowCountState]);

  const [open, setOpen] = React.useState(false);
  const [openUpdateOrderDialog, setOpenUpdateOrderDialog] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<MappedOrder[]>([]);

  React.useEffect(() => {
    if (selectedRows.length === 0) {
      setOpen(false);
      mutate();
    }
  }, [selectedRows]);

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
      mutate();
    } else {
      setNotification({ type: "error", message: response.error });
      onError();
    }
  };

  const handleReturnOrderForPreparationClick = async (data: MappedOrder[]) => {
    await changeStatus(data, OrderStatus.NEW);
    mutate();
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

  const mapRows = async (content) => {
    setIsLoading(true);
    console.time();
    const rows = await mapOrders(
      content,
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
      Boolean(econtOffices.length) &&
      Boolean(speedyOffices.length) &&
      Boolean(econtCities.length) &&
      Boolean(econtCountries.length)
    ) {
      mapRows(content);
    }
  }, [
    econtOffices,
    speedyOffices,
    econtCities,
    econtCountries,
    isLoadingData,
    content,
  ]);

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    setPage(0);
    setFilters(filterModel.items);
  }, []);

  const handleSortModelChange = React.useCallback(
    (sortModel: GridSortModel) => {
      setSorting(sortModel[0]);
    },
    []
  );

  return (
    <>
      <PageContainer>
        <Table
          loading={isLoading || isLoadingData}
          rows={mappedRows || []}
          onCollectGoods={handleCollectGoods}
          onUpdateOrder={handleUpdateOrderClick}
          onReturnForPreparation={handleReturnOrderForPreparationClick}
          processRowUpdate={processRowUpdate}
          onCancelOrder={handleCancelOrder}
          rowCount={rowCountState}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={onFilterChange}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
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
