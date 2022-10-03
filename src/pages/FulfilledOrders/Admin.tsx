import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import { Order, OrderStatus } from "../../types";
import useSWR from "swr";
import { API_ENDPOINTS } from "../../api";
import { jsonFetch } from "../../utils/fetch";
import OrderSummaryDialog from "./OrderSummaryDialog";

export default function Admin() {
  const { data = [], isLoading } = useSWR<Order[]>(
    API_ENDPOINTS.Order,
    jsonFetch
  );

  const rows = React.useMemo(
    () => data.filter((order) => order.status === OrderStatus.ARCHIVED),
    [data]
  );

  return (
    <>
      <PageContainer title="Приключени поръчки">
        <Table loading={isLoading} rows={rows} Editor={OrderSummaryDialog} />
      </PageContainer>
    </>
  );
}
