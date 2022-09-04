import React from "react";
import PageContainer from "../../components/PageContainer";
import WarehouseTable from "./WarehouseTable";
import WarehouseDialog from "./WarehouseDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function WarehouseAdmin() {
  const { trigger } = useSWRMutation(API_ENDPOINTS.Warehouse, sendRequest);

  return (
    <PageContainer title="Складове">
      <WarehouseTable Editor={WarehouseDialog} onEditorSave={trigger} />
    </PageContainer>
  );
}
