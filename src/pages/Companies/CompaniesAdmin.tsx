import React from "react";
import PageContainer from "../../components/PageContainer";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";

async function sendRequest(url, options) {
  // jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function CompaniesAdmin() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/user",
    sendRequest
  );
  console.log("IS MUTATING:", isMutating);
  const handleSave = async (data) => {
    return trigger(data);
  };
  return (
    <PageContainer title="Складове">
      <CompanyTable Editor={CompanyDialog} onEditorSave={handleSave} />
    </PageContainer>
  );
}
