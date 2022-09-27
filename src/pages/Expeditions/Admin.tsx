import React from "react";
import PageContainer from "../../components/PageContainer";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";
import ExpeditionsTable from "./Table";

export default function CompaniesAdmin() {
  const { data = [], isLoading } = useSWR(
    API_ENDPOINTS.DeliveryDetails,
    jsonFetch
  );

  return (
    <PageContainer title="Експедиции">
      <ExpeditionsTable loading={isLoading} rows={data} />
    </PageContainer>
  );
}
