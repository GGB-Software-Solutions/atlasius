import * as React from "react";
import {
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { FormProduct, ProductResponse } from "../../types/product";
import useStore from "../../store/globalStore";
import { Warehouse } from "../../types";
import { Company } from "../Companies/types";
import {
  getBackgroundColor,
  getHoverBackgroundColor,
} from "../../utils/common";
import withClientFiltering from "../../hocs/withClientFiltering";
import compose from "../../utils/compose";

const columns = (warehouses: Warehouse[]): GridColDef<FormProduct>[] => [
  { field: "id", type: "number", hide: true, headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Име на продукт",
    width: 350,
  },
  {
    field: "sku",
    headerName: "SKU",
    width: 150,
  },
  {
    field: "ean",
    headerName: "Баркод",
    width: 150,
  },
  {
    field: "category",
    headerName: "Категория",
    width: 150,
  },
  {
    field: "weight",
    headerName: "Тегло",
    type: "number",
    width: 100,
  },
  {
    field: "company",
    width: 150,
    headerName: "Компания",
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.company?.name}`,
  },
  {
    field: "productWarehouseQuantities",
    headerName: "Наличност",
    sortable: false,
    width: 400,
    valueGetter: (
      params: GridValueGetterParams<string, FormProduct>
    ): string => {
      return `${params.row.productWarehouseQuantities
        .map((quantity) => {
          const warehouse = warehouses.find(
            (warehouse) => warehouse.id.toString() === quantity.warehouseId
          );
          return `${warehouse?.name}/${quantity.quantity}`;
        })
        .join("\n")}`;
    },
  },
  {
    field: "productWarehouseQuantities1",
    headerName: "Резервирани",
    sortable: false,
    width: 400,
    valueGetter: (params: GridValueGetterParams<string, FormProduct>) => {
      return `${params.row.productWarehouseQuantities
        .map((quantity) => {
          const warehouse = warehouses.find(
            (warehouse) => warehouse.id.toString() === quantity.warehouseId
          );
          return `${warehouse?.name}/${quantity.reserved}`;
        })
        .join("\n")}`;
    },
  },
];

interface Props {
  onRowClick: (params: Partial<GridRowParams>) => void;
  rows: FormProduct[];
}

const mapProducts = (products) =>
  products.reduce((p, c) => {
    const key = c.productId.sku + c.productId.companyId;
    if (p.has(key)) {
      const product = p.get(key);
      product.productWarehouseQuantities =
        product.productWarehouseQuantities || [];
      product.productWarehouseQuantities.push({
        quantity: c.quantity,
        itemLocation: c.itemLocation,
        reserved: c.reserved,
        warehouseId: c.warehouseId,
      });

      p.set(key, product);
    } else {
      c.productWarehouseQuantities = [
        {
          quantity: c.quantity,
          itemLocation: c.itemLocation,
          reserved: c.reserved,
          warehouseId: c.warehouseId,
        },
      ];
      p.set(key, c);
    }
    return p;
  }, new Map());

const transform = (
  products: ProductResponse[] = [],
  companies: Company[]
): FormProduct[] =>
  products.map((product) => ({
    ...product,
    company: companies.find(
      (company) => company.id === product.productId.companyId
    ) as Company,
  }));

export const ProductsTable = ({ onRowClick, rows, ...other }: Props) => {
  const selectedCompany = useStore((state) => state.selectedCompany);
  const warehouses = useStore((state) => state.warehouses);
  const companies = useStore((state) => state.companies);

  const mappedRows = React.useMemo(() => {
    const mappedProducts = Array.from(mapProducts(rows).values());
    return transform(mappedProducts, companies);
  }, [rows, companies]);

  return (
    <Table
      sx={{
        "& .row--Promotion": {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.info.main, theme.palette.mode),
          "&:hover": {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode
              ),
          },
        },
      }}
      getRowClassName={(params) =>
        `row--${params.row.promotions ? "Promotion" : "Default"}`
      }
      title={"Продукти"}
      getRowId={(row) => row.id}
      isRowSelectable={(params) => !params.row.promotions}
      actions={() => {
        return (
          <>
            {onRowClick && (
              <Button
                onClick={() => {
                  onRowClick({
                    row: {
                      company: selectedCompany,
                    },
                  });
                }}
              >
                Добави
              </Button>
            )}
          </>
        );
      }}
      columns={columns(warehouses)}
      onRowClick={onRowClick}
      rows={mappedRows}
      {...other}
    />
  );
};

export default compose(withEditor, withClientFiltering)(ProductsTable);
