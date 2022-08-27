import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Table from "../../components/Table";
import { getData } from "../../utils/xlsx";

const columns: GridColDef[] = [
  { field: "Ean", headerName: "Баркод", width: 200 },
  {
    field: "Product name",
    headerName: "Име на продукт",
    width: 400,
  },
  {
    field: "ml",
    headerName: "Тегло",
    type: "number",
    width: 150,
  },
  {
    field: "Общо Бройка",
    headerName: "Общо бройка",
    type: "number",
    width: 150,
    editable: true,
  },
];

export interface DeliveredProduct {
  Ean: string;
  "Product name": string;
  ml: number;
  Type: string;
  Контрагент: string;
  "Общо Бройка": number;
}

interface Props {
  onSubmitForDelivery: (data: DeliveredProduct[]) => void;
}

const GoodsTable = ({ onSubmitForDelivery }: Props) => {
  const [rows, setRows] = React.useState<DeliveredProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    setLoading(true);
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = (evt) => {
      if (evt.target?.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result as ArrayBuffer;
        const data = getData<DeliveredProduct>(arrayBuffer);
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
      actions={(rowsMap) => (
        <>
          <Button
            disabled={!Boolean(rowsMap.size)}
            onClick={() => {
              const rowIdsToDelete = Array.from(rowsMap.keys());
              setRows((rows) =>
                rows.filter((row) => !rowIdsToDelete.includes(row.Ean))
              );
            }}
          >
            Изтрий
          </Button>
          <Button
            disabled={!Boolean(rowsMap.size)}
            onClick={() => onSubmitForDelivery(Array.from(rowsMap.values()))}
          >
            Заприходи
          </Button>
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

export default GoodsTable;
