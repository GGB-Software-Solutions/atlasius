import React from "react";
import PageContainer from "../../components/PageContainer";
import WarehouseTable from "./WarehouseTable";
import WarehouseDialog from "./WarehouseDialog";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendRequest(url, options) {
  console.log("OPTIONS:", options);
  await sleep(5000);
  return true;
  // jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function WarehouseAdmin() {
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
      <WarehouseTable Editor={WarehouseDialog} onEditorSave={handleSave} />
    </PageContainer>
  );
}
