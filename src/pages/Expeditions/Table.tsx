import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table, { Props } from "../../components/Table";
import { Expedition } from "../../types/expedition";
import useStore from "../../store/globalStore";
import { Company } from "../Companies/types";

const columns: GridColDef<Expedition>[] = [
  {
    field: "shipmentId",
    type: "number",
    headerName: "ID",
    width: 150,
  },
  {
    field: "orderId",
    headerName: "Поръчка",
    width: 150,
  },
  {
    field: "deliveryCompany",
    headerName: "Куриер",
    width: 120,
  },
  {
    field: "deliveryPrice",
    headerName: "Цена за доставка",
    width: 250,
  },
  {
    field: "status",
    headerName: "Статус",
    width: 250,
  },
  {
    field: "pdfUrl",
    headerName: "URL",
    width: 250,
  },
  {
    field: "company",
    width: 150,
    headerName: "Компания",
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.company?.name || ""}`,
  },
];

const map = (rows: Expedition[], companies: Company[]) =>
  rows.map((row) => ({
    ...row,
    company: companies.find((company) => company.id === row.companyId),
  }));

const ExpeditionsTable = ({ rows }: Omit<Props<Expedition>, "columns">) => {
  const companies = useStore((state) => state.companies);
  return (
    <Table
      getRowId={(row) => row.shipmentId}
      title="Експедиции"
      rows={map(rows, companies)}
      columns={columns}
    />
  );
};

export default ExpeditionsTable;
