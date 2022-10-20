import { Autocomplete, TextField } from "@mui/material";
import { GridFilterInputValueProps } from "@mui/x-data-grid";
import { ErrorStatus, OrderStatus, WarehouseStatus } from "../../types";

const options = [
  {
    label: "Готова за събиране",
    value: {
      status: OrderStatus.NEW,
      warehouseStatus: WarehouseStatus.PICKING,
      errorStatus: null,
    },
  },
  {
    label: "Готова за пакетиране",
    value: {
      status: OrderStatus.NEW,
      warehouseStatus: WarehouseStatus.PACKING,
      errorStatus: null,
    },
  },
  {
    label: "В процес на събиране",
    value: {
      status: OrderStatus.RESERVED,
      warehouseStatus: WarehouseStatus.PICKING,
      errorStatus: null,
    },
  },
  {
    label: "В процес на пакетиране",
    value: {
      status: OrderStatus.RESERVED,
      warehouseStatus: WarehouseStatus.PACKING,
      errorStatus: null,
    },
  },
  {
    label: "Изпратена",
    value: {
      status: OrderStatus.ARCHIVED,
      warehouseStatus: WarehouseStatus.SHIPPING,
      errorStatus: null,
    },
  },
  {
    label: "Отказана",
    value: { status: OrderStatus.CANCELLED, errorStatus: null },
  },
  {
    label: "Невалиден адрес",
    value: { errorStatus: ErrorStatus.WRONG_ADDRESS },
  },
  {
    label: "Липсващ продукт",
    value: { errorStatus: ErrorStatus.MISSING_PRODUCT },
  },
  {
    label: "Невалиден телефон",
    value: { errorStatus: ErrorStatus.MISSING_WRONG_PHONE },
  },
  {
    label: "Недостатъчно количество",
    value: { errorStatus: ErrorStatus.NOT_ENOUGH_QUANTITY },
  },
];

function StatusFilter(props: GridFilterInputValueProps) {
  const { item, applyValue } = props;

  const handleFilterChange = (event, newValue) => {
    console.log("New value:", newValue);
    applyValue({ ...item, value: newValue?.value });
  };

  return (
    <Autocomplete
      value={item.value}
      onChange={handleFilterChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => {
        return option.value === value;
      }}
      options={options}
      renderInput={(params) => (
        <TextField {...params} label="Статус" variant="standard" />
      )}
    />
  );
}

export default StatusFilter;
