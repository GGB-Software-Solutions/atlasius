import React from "react";
import PageContainer from "../../components/PageContainer";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";
import { Company } from "./types";

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

const map = (company: Company) => ({
  ...company,
  warehouseName: company.warehouse.map((warehouse) => warehouse.name),
});

export default function CompaniesAdmin() {
  const { data } = useSWR(API_ENDPOINTS.Company, jsonFetch);
  const { trigger } = useSWRMutation(API_ENDPOINTS.Company, sendRequest);

  const handleSave = (data: Company) => {
    trigger(map(data));
  };

  return (
    <PageContainer title="Компании">
      <CompanyTable
        rows={data || []}
        Editor={CompanyDialog}
        onEditorSave={handleSave}
      />
    </PageContainer>
  );
}
