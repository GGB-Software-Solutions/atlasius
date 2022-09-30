import { darken, lighten } from "@mui/material/styles";
import { Company, DeliveryCompany } from "../pages/Companies/types";

export const getSelectOptions = (tsEnum) =>
  Object.keys(tsEnum)
    .filter((key) => Number.isNaN(Number(key)))
    .map((entry) => ({ id: tsEnum[entry], label: entry }));

export const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

export const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

export const getDeliveryCompanyCredentials = (
  company: Company,
  deliveryCompany: DeliveryCompany
) =>
  company.deliveryCompanyCredentials.find(
    (credentials) => credentials.deliveryCompanyName === deliveryCompany
  );
