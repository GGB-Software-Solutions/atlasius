import { TextField } from "@mui/material";
import React from "react";

interface Props {
  onScan: (barcode: string) => void;
}

export default function BarcodeInput({ onScan }: Props) {
  const [barcode, setBarcode] = React.useState("");
  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      onScan(barcode);
      setBarcode("");
    }
  };

  const handleChange = (e) => {
    setBarcode(e.target.value);
  };

  return (
    <TextField
      value={barcode}
      onChange={handleChange}
      onKeyPress={onKeyPress}
      autoFocus
      helperText="При ръчно вписване на баркод натисни Enter"
    />
  );
}
