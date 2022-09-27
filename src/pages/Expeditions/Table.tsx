import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Table, { Props } from "../../components/Table";
import { Expedition } from "../../types/expedition";

const columns: GridColDef<Expedition>[] = [
  {
    field: "shipmentId",
    type: "number",
    hide: true,
    headerName: "ID",
    width: 90,
  },
  {
    field: "companyId",
    headerName: "Име на компания",
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
    field: "trackingNumber",
    headerName: "Тракинг номер",
    width: 150,
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
];

const ExpeditionsTable = ({ rows }: Omit<Props<Expedition>, "columns">) => {
  return <Table title="Експедиции" rows={rows} columns={columns} />;
};

export default ExpeditionsTable;
