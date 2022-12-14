import { Button } from "@mui/material";
import React from "react";
import Table, { Props as TableProps } from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { Order } from "../../types";
import { columns } from "../Orders/Table";

type Props = {
  rows: Order[];
} & Partial<TableProps<Order>>;

function FulfilledOrdersTable(props: Props) {
  return (
    <Table
      actions={() => (
        <Button
          onClick={() => {
            props.onRowClick({ row: {} });
          }}
        >
          Добави
        </Button>
      )}
      columns={columns}
      {...props}
      // initialState={{
      //   columns: {
      //     columnVisibilityModel: {
      //       status: false,
      //     },
      //   },
      // }}
    />
  );
}

export default withEditor<Order>(FulfilledOrdersTable);
