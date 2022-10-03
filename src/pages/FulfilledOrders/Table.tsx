import React from "react";
import Table, { Props as TableProps } from "../../components/Table";
import withEditor from "../../components/Table/withEditor";
import { Order } from "../../types";
import { columns } from "../Orders/Table";

type Props = {
  rows: Order[];
} & Partial<TableProps<Order>>;

function FulfilledOrdersTable(props: Props) {
  props.rows;
  return (
    <Table
      columns={columns}
      {...props}
      initialState={{
        columns: {
          columnVisibilityModel: {
            status: false,
          },
        },
      }}
    />
  );
}

export default withEditor<Order>(FulfilledOrdersTable);
