import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import { getData } from "../../utils/xlsx";
import withEditor from "../../components/Table/withEditor";

const columns: GridColDef[] = [
  { field: "Ean", headerName: "Баркод", width: 200 },
  {
    field: "Product name",
    headerName: "Име на продукт",
    width: 400,
  },
  {
    field: "ml",
    headerName: "Количество",
    type: "number",
    width: 150,
  },
  {
    field: "Общо Бройка",
    headerName: "Общо бройка",
    type: "number",
    width: 150,
  },
];

interface Product {
  Ean: string;
  "Product name": string;
  ml: number;
  Type: string;
  Контрагент: string;
  "Общо Бройка": number;
}

const GoodsTable = ({ onRowClick }) => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    setLoading(true);
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result as ArrayBuffer;
        const data = getData(arrayBuffer);
        setRows(data);
        setLoading(false);
      }
    };
  };

  return (
    <Table
      title="Стока за заприхождаване"
      loading={loading}
      getRowId={(row) => row.Ean}
      actions={() => (
        <>
          {/* <Button
            onClick={() => {
              onRowClick({ row: {} });
            }}
          >
            Добави
          </Button> */}
          <Button variant="contained" component="label">
            Прикачи файл
            <input hidden multiple type="file" onChange={handleFileUpload} />
          </Button>
        </>
      )}
      rows={rows}
      columns={columns}
    />
  );
};

export default withEditor(GoodsTable);
