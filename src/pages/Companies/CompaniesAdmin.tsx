import React from "react";
import PageContainer from "../../components/PageContainer";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function CompaniesAdmin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Company, sendRequest);
  return (
    <PageContainer title="Складове">
      <CompanyTable Editor={CompanyDialog} onEditorSave={trigger} />
    </PageContainer>
  );
}
