import React from "react";
import useStore from "../store/globalStore";
import { GridFilterItem, GridFilterModel } from "@mui/x-data-grid";

export default (WrappedComponent) => {
  const hocComponent = (props) => {
    const [filters, setFilters] = React.useState<GridFilterItem[]>([]);
    const selectedCompany = useStore((state) => state.selectedCompany);

    React.useEffect(() => {
      if (selectedCompany) {
        setFilters((filters) => {
          return [
            ...filters.filter((filter) => filter.columnField !== "company"),
            {
              columnField: "company",
              operatorValue: "equals",
              value: selectedCompany.name,
            },
          ];
        });
      }
    }, [selectedCompany.name]);

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
      setFilters(filterModel.items);
    }, []);
    return (
      <WrappedComponent
        {...props}
        filterModel={{
          items: filters,
        }}
        onFilterModelChange={onFilterChange}
      />
    );
  };
  return hocComponent;
};
