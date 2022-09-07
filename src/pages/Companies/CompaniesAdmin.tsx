import React from "react";
import PageContainer from "../../components/PageContainer";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function CompaniesAdmin() {
  const { data } = useSWR(API_ENDPOINTS.Company, jsonFetch);
  const { trigger } = useSWRMutation(API_ENDPOINTS.Company, sendRequest);
  return (
    <PageContainer title="Складове">
      <CompanyTable
        rows={data?.content || []}
        Editor={CompanyDialog}
        onEditorSave={trigger}
      />
    </PageContainer>
  );
}
