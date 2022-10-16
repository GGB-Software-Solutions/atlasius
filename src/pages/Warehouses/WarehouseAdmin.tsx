import React from "react";
import PageContainer from "../../components/PageContainer";
import WarehouseTable from "./WarehouseTable";
import WarehouseDialog from "./WarehouseDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import { API_ENDPOINTS } from "../../api";
import useSWR from "swr";

async function sendRequest(url: string, options: Record<string, unknown>) {
  return jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function WarehouseAdmin() {
  const { data } = useSWR(API_ENDPOINTS.Warehouse, jsonFetch);
  const { trigger } = useSWRMutation(API_ENDPOINTS.Warehouse, sendRequest);

  return (
    <PageContainer>
      <WarehouseTable
        rows={data || []}
        Editor={WarehouseDialog}
        onEditorSave={trigger}
      />
    </PageContainer>
  );
}
