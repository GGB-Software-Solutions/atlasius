import { Chip, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { DeliveryCompany } from "../../Companies/types";

interface Props {
  isValid: boolean;
  isLoading: boolean;
  deliverToOffice: boolean;
  deliveryCompany: DeliveryCompany;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ValidAddress({
  isValid,
  isLoading,
  deliverToOffice,
  deliveryCompany,
}: Props) {
  const getlabel = () => {
    let validOrInvalid = "Невалиден";
    let officeOrAddres = "адрес";
    if (isValid) {
      validOrInvalid = "Валиден";
    }
    if (deliverToOffice) officeOrAddres = "офис";
    return `${validOrInvalid} ${officeOrAddres}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "25px",
      }}
    >
      <Typography variant="h4">
        Доставка с {capitalize(deliveryCompany.toLowerCase())}
      </Typography>
      {!isLoading && (
        <Chip
          color={isValid ? "success" : "error"}
          icon={isValid ? <CheckCircleIcon /> : <ErrorIcon />}
          label={getlabel()}
        />
      )}
    </div>
  );
}
