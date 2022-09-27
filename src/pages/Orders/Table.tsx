import React from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button, Chip } from "@mui/material";
import Table, { Props as TableProps } from "../../components/Table";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";

import { getDeliveryCourier, shouldOrderBeDeliveredToOffice } from "./utils";
import CircleIcon from "@mui/icons-material/Circle";
import {
  ErrorStatus,
  MappedOrder,
  OrderStatus,
  WarehouseStatus,
} from "../../types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150, hide: true },
  {
    field: "status",
    width: 250,
    headerName: "Статус",
    renderCell: (params: GridRenderCellParams) => {
      const { status, warehouseStatus, errorStatus } = params.row;
      let label;
      let color;
      if (
        status === OrderStatus.NEW &&
        warehouseStatus === WarehouseStatus.PICKING
      ) {
        label = "Готова за събиране";
      }

      if (
        status === OrderStatus.NEW &&
        warehouseStatus === WarehouseStatus.PACKING
      ) {
        label = "Готова за пакетиране";
      }

      if (
        status === OrderStatus.RESERVED &&
        warehouseStatus === WarehouseStatus.PICKING
      ) {
        label = "В процес на събиране";
      }

      if (
        status === OrderStatus.RESERVED &&
        warehouseStatus === WarehouseStatus.PACKING
      ) {
        label = "В процес на пакетиране";
      }

      if (errorStatus === ErrorStatus.WRONG_ADDRESS) {
        label = "Невалиден адрес";
      }

      if (errorStatus === ErrorStatus.MISSING_PRODUCT) {
        label = "Липсващ продукт";
      }

      if (errorStatus === ErrorStatus.MISSING_PHONE) {
        label = "Невалиден/липсващ телефон";
      }

      if (errorStatus === ErrorStatus.NOT_ENOUGH_QUANTITY) {
        label = "Недостатъчно количество";
      }

      if (status === OrderStatus.RESERVED) {
        color = "#9ea7ad";
      }

      if (status === OrderStatus.NEW) {
        color = "#56f000";
      }

      if (errorStatus) {
        color = "#ff3838";
      }

      return (
        <Chip
          icon={
            <CircleIcon
              sx={{
                color: color + " !important",
              }}
            />
          }
          label={label}
        />
      );
    },
  },
  {
    field: "validatedAddress",
    headerName: "Валиден адрес",
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

// !== Archived !== Cancelled and !== Shipped and !== Unfullfilled
// New and Picking
// New and Packing
// Reserved and Picking
// Reserved and Packing

type Props = {
  onCollectGoods: (data: MappedOrder[]) => void;
  onUpdateOrder: (data: MappedOrder[]) => void;
  rows: MappedOrder[];
} & TableProps<MappedOrder>;

const OrdersTable = ({
  onCollectGoods,
  onUpdateOrder,
  rows = [],
  ...other
}: Props) => {
  return (
    <Table
      {...other}
      title="Поръчки"
      isRowSelectable={(params: GridRowParams) =>
        params.row.status !== OrderStatus.RESERVED
      }
      actions={(rowsMap) => {
        const rows = Array.from(rowsMap.values());
        const isRowsStatusTheSame =
          rows && rows.length
            ? rows.every(
                (row) =>
                  row.status === rows[0].status &&
                  row.warehouseStatus === rows[0].warehouseStatus
              )
            : false;
        if (
          rows &&
          rows.length &&
          rows[0].errorStatus &&
          onUpdateOrder &&
          isRowsStatusTheSame
        ) {
          return (
            <Button onClick={() => onUpdateOrder(rows)}>
              {"Актуализирай поръчка"}
            </Button>
          );
        }

        if (rows && rows.length && onCollectGoods && isRowsStatusTheSame) {
          const label =
            rows[0].warehouseStatus === WarehouseStatus.PICKING
              ? "Събери стока"
              : "Пакетирай стока";
          return <Button onClick={() => onCollectGoods(rows)}>{label}</Button>;
        }
      }}
      rows={rows}
      columns={columns}
    />
  );
};

export default OrdersTable;
