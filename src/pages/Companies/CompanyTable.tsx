import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { Company } from "./types";

const columns: GridColDef<Company>[] = [
  { field: "id", type: "number", hide: true, headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Име на компания",
    width: 150,
  },
  {
    field: "responsiblePerson",
    headerName: "МОЛ",
    width: 150,
  },
  {
    field: "vatNumber",
    headerName: "ДДС номер",
    width: 120,
  },
  {
    field: "phone",
    headerName: "Телефон",
    width: 150,
  },
  {
    field: "email",
    headerName: "Имейл",
    width: 250,
  },
  {
    field: "warehouse",
    headerName: "Складове",
    sortable: false,
    width: 250,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.warehouse.map((warehouse) => warehouse.name).join(",")} `,
  },
];

const CompanyTable = ({ onRowClick, rows }) => {
  return (
    <Table
      title="Компании"
      actions={() => (
        <Button
          onClick={() => {
            onRowClick({ row: {} });
          }}
        >
          Добави
        </Button>
      )}
      rows={rows}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default withEditor<Company>(CompanyTable);
