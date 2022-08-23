import React from "react";
import PageContainer from "../../components/PageContainer";
import Table from "./Table";
import useSWRMutation from "swr/mutation";
import { jsonFetch } from "../../utils/fetch";
import ProductDialog from "./Dialog";

async function sendRequest(url, options) {
  // jsonFetch(url, { method: "POST", body: JSON.stringify(options.arg) });
}

export default function Admin() {
  const handleSave = async (data) => {
    // return trigger(data);
  };
  return (
    <PageContainer title="Продукти">
      <Table Editor={ProductDialog} onEditorSave={handleSave} />
    </PageContainer>
  );
}
