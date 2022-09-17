import React from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";

import { getDeliveryCourier, shouldOrderBeDeliveredToOffice } from "./utils";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 10, hide: true },
  {
    field: "validatedAddress",
    headerName: "",
    renderCell: (params: GridRenderCellParams) => {
      const isToOffice = shouldOrderBeDeliveredToOffice(params.row);
      let isValidShippingAddress = isToOffice
        ? Boolean(params.row.officeId)
        : Boolean(params.row.validatedAddress);
      if (isValidShippingAddress) return <CheckCircleIcon color="success" />;
      return <WarningIcon color="warning" />;
    },
  },
  {
    field: "firstName",
    headerName: "Клиент",
    width: 250,
    sortable: false,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName} ${params.row.lastName}`,
  },
  {
    field: "officeId",
    headerName: "До офис",
    renderCell: (params: GridRenderCellParams) => {
      const isToOffice = shouldOrderBeDeliveredToOffice(params.row);
      return isToOffice ? (
        <CheckCircleIcon color="primary" />
      ) : (
        <CancelIcon color="secondary" />
      );
    },
  },
  {
    field: "officeName",
    headerName: "До офис",
    valueGetter: (params: GridValueGetterParams) =>
      `${getDeliveryCourier(params.row)}`,
  },
  {
    field: "city",
    headerName: "Град",
    width: 150,
    valueGetter: (params: GridValueGetterParams) => {
      if (typeof params.row.city === "string") return params.row.city;
      return params.row.city.name;
    },
  },
  {
    field: "address1",
    headerName: "Адрес",
    width: 500,
  },
];

const OrdersTable = ({ onCollectGoods, rows = [], ...other }) => {
  return (
    <Table
      title="Поръчки"
      actions={(rowsMap) => (
        <>
          {onCollectGoods && (
            <Button
              onClick={() => onCollectGoods(Array.from(rowsMap.values()))}
            >
              Събери стока
            </Button>
          )}
        </>
      )}
      rows={rows}
      columns={columns}
      {...other}
    />
  );
};

export default OrdersTable;
