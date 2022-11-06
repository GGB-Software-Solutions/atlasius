// NOT_EQUAL("neq"),
// GREATER_THAN("gt"),
// GREATER_THAN_OR_EQUAL_TO("gte"),
// LESS_THAN("lt"),
// LESSTHAN_OR_EQUAL_TO("lte"),
// IN("in"),
// NOT_IN("nin"),
// BETWEEN("btn"),
// NOT_CONTAINS("notLike"),
// IS_NULL("isnull"),
// IS_NOT_NULL("isnotnull"),
// JOIN("jn"),

import { GridFilterItem } from "@mui/x-data-grid";

export const operatorMap = {
  equals: "eq",
  contains: "like",
  startsWith: "startwith",
  endsWith: "endwith",
  isEmpty: "isempty",
  isNotEmpty: "isnotempty",
  is: "is",
  not: "neq",
  isnull: "isnull",
};

export const mapFilters = (filters: GridFilterItem[] = []) => {
  return filters
    .map(
      (filter) =>
        `${filter.columnField}|${operatorMap[filter.operatorValue]}${
          filter.value ? "|" + filter.value : "|" + filter.value
        }`
    )
    .join("&");
};
