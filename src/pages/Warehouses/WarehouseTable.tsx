import React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { warehouses } from "../../mocks/mocks";

const columns: GridColDef[] = [
  { field: "id", type: "number", hide: true, headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Име на склад",
    width: 150,
  },
  {
    field: "address1",
    headerName: "Адрес",
    sortable: false,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.address1 || ""} ${params.row.address2 || ""}`,
  },
  {
    field: "city",
    headerName: "Град",
  },
  {
    field: "zipCode",
    headerName: "Пощенски код",
    width: 120,
  },
  {
    field: "country",
    headerName: "Страна",
  },
  {
    field: "phone",
    headerName: "Телефон за контакт",
    width: 150,
  },
];

const Warehouses = ({ onRowClick }) => {
  return (
    <Table
      title="Складове"
      actions={() => (
        <Button
          onClick={() => {
            onRowClick({ row: {} });
          }}
        >
          Добави
        </Button>
      )}
      rows={warehouses}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default withEditor(Warehouses);
