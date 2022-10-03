import React from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button, Chip } from "@mui/material";
import Table, { Props as TableProps } from "../../components/Table";

import { getDeliveryCourier, shouldOrderBeDeliveredToOffice } from "./utils";
import CircleIcon from "@mui/icons-material/Circle";
import {
  ErrorStatus,
  MappedOrder,
  OrderStatus,
  WarehouseStatus,
} from "../../types";
import { ProductResponse } from "../../types/product";

export const columns: GridColDef[] = [
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

      if (
        status === OrderStatus.ARCHIVED &&
        warehouseStatus === WarehouseStatus.SHIPPING
      ) {
        label = "Изпратена";
      }

      if (errorStatus === ErrorStatus.WRONG_ADDRESS) {
        label = "Невалиден адрес";
      }

      if (errorStatus === ErrorStatus.MISSING_PRODUCT) {
        label = "Липсващ продукт";
      }

      if (errorStatus === ErrorStatus.MISSING_WRONG_PHONE) {
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

      if (status === OrderStatus.ARCHIVED) {
        color = "#2e7d32";
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
    field: "firstName",
    headerName: "Клиент",
    width: 250,
    sortable: false,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName} ${params.row.lastName}`,
  },
  {
    field: "phone",
    headerName: "Телефон",
    editable: true,
    width: 125,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "officeId",
    type: "boolean",
    headerName: "До офис",
    valueGetter: (params: GridValueGetterParams) =>
      shouldOrderBeDeliveredToOffice(params.row),
  },
  {
    field: "officeName",
    headerName: "Куриер",
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
  {
    field: "paymentType",
    headerName: "Вид плащане",
    width: 150,
  },
  {
    field: "company",
    width: 150,
    headerName: "Компания",
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.company?.name}`,
  },
  {
    field: "products",
    width: 150,
    headerName: "Продукти",
    valueGetter: (
      params: GridValueGetterParams<string, ProductResponse>
    ): string => {
      return `${params.row.products
        .map((product) => `${product.name}/${product.orderedQuantity}`)
        .join("\n")}`;
    },
  },
];

// !== Archived !== Cancelled and !== Shipped and !== Unfullfilled
// New and Picking
// New and Packing
// Reserved and Picking
// Reserved and Packing

const getActions = ({
  rows,
  onCancelOrder,
  onUpdateOrder,
  onCollectGoods,
  onReturnForPreparation,
}) => {
  if (rows && rows.length) {
    const isRowsStatusTheSame = rows.every(
      (row) =>
        row.status === rows[0].status &&
        row.warehouseStatus === rows[0].warehouseStatus
    );

    const actions = [
      <Button onClick={() => onCancelOrder(rows)}>{"Анулирай поръчки"}</Button>,
    ];

    if (isRowsStatusTheSame) {
      if (rows[0].errorStatus && onUpdateOrder) {
        actions.push(
          <Button onClick={() => onUpdateOrder(rows)}>
            {"Актуализирай поръчка"}
          </Button>
        );
        return actions;
      }

      if (rows[0].status === OrderStatus.RESERVED && onReturnForPreparation) {
        actions.push(
          <Button onClick={() => onReturnForPreparation(rows)}>
            {"Върни за обработка"}
          </Button>
        );
        return actions;
      }

      if (onCollectGoods && isRowsStatusTheSame) {
        const label =
          rows[0].warehouseStatus === WarehouseStatus.PICKING
            ? "Събери стока"
            : "Пакетирай стока";
        actions.push(
          <Button onClick={() => onCollectGoods(rows)}>{label}</Button>
        );
        return actions;
      }
    }
    return actions;
  }
};

type Props = {
  onCollectGoods?: (data: MappedOrder[]) => void;
  onUpdateOrder?: (data: MappedOrder[]) => void;
  onReturnForPreparation?: (data: MappedOrder[]) => void;
  onCancelOrder?: (data: MappedOrder[]) => void;
  rows: MappedOrder[];
} & Partial<TableProps<MappedOrder>>;

const OrdersTable = ({
  onCollectGoods,
  onUpdateOrder,
  onReturnForPreparation,
  onCancelOrder,
  rows = [],
  ...other
}: Props) => {
  return (
    <Table
      {...other}
      title="Поръчки"
      experimentalFeatures={{ newEditingApi: true }}
      actions={(rowsMap) => {
        const rows = Array.from(rowsMap.values());
        return (
          <>
            {getActions({
              rows,
              onCancelOrder,
              onCollectGoods,
              onReturnForPreparation,
              onUpdateOrder,
            })}
          </>
        );
      }}
      rows={rows}
      columns={columns}
    />
  );
};

export default OrdersTable;
