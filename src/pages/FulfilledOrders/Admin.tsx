import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import { Order, OrderStatus } from "../../types";
import useSWR from "swr";
import { API_ENDPOINTS } from "../../api";
import { jsonFetch } from "../../utils/fetch";
import OrderSummaryDialog from "./OrderSummaryDialog";
import useStore from "../../store/globalStore";
import { mapFilters } from "../../components/Table/utils";
import {
  GridFilterItem,
  GridFilterModel,
  GridSortItem,
  GridSortModel,
} from "@mui/x-data-grid";

const archivedStatusFilter = {
  columnField: "status",
  operatorValue: "equals",
  value: OrderStatus.ARCHIVED,
};

const cancelledStatusFilter = {
  columnField: "status",
  operatorValue: "equals",
  value: OrderStatus.CANCELLED,
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
      ]
    : [];

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [sorting, setSorting] = React.useState<GridSortItem>();
  const [filters, setFilters] = React.useState<GridFilterItem[]>([]);

  const params = {
    page,
    size: pageSize,
    sort: sorting ? `${sorting?.field},${sorting?.sort}` : "",
    filterAnd: mapFilters([...filters, ...initialCompanyFilter]),
    filterOr: mapFilters([archivedStatusFilter, cancelledStatusFilter]),
  };

  const { data = {}, isLoading } = useSWR(
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
      <PageContainer title="Приключени поръчки">
        <Table
          loading={isLoading}
          rows={data.content || []}
          Editor={OrderSummaryDialog}
          page={page}
          pageSize={pageSize}
          rowCount={rowCountState}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={onFilterChange}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </PageContainer>
    </>
  );
}
