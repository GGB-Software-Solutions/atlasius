import { darken, lighten } from "@mui/material/styles";
import {
  Company,
  DeliveryCalculationType,
  DeliveryCompany,
  DeliveryCompanyCredentials,
  DeliveryPayer,
} from "../pages/Companies/types";

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

export const getDeliveryPriceAndPayer = (
  credentials: DeliveryCompanyCredentials,
  price: number
) => {
  let orderPrice = price;
  let courierServicePayer = "SENDER";
  const isFixedDeliveryPrice =
    Number(credentials?.deliveryCalculationType) ===
    DeliveryCalculationType["Фиксирана стойност по цена"];

  //Фиксирана цена на доставка
  if (isFixedDeliveryPrice) {
    const fixedDeliveryOption = credentials.fixedDeliveryOptions.find(
      (option) => price >= option.from && price <= option.to
    );
    //Ако цената на поръчката попадне в някой от рейнджовете за фиксирана цена на доставка тогава доставката се плаща от нас и я добавяме фиксираната цена към цената на наложения платеж
    if (fixedDeliveryOption) {
      orderPrice += fixedDeliveryOption.price;
      courierServicePayer = "SENDER";
    } else {
      //Ако цената на поръчката не попадне в някой от рейнджовете за фиксирана цена на доставка тогава доставката се плаща от получателя
      courierServicePayer = "RECIPIENT";
    }
    //Калкулирана доставка
  } else {
    const { to, payer } = credentials?.calculatedDeliveryOption;
    if (orderPrice <= to) {
      courierServicePayer =
        payer === DeliveryPayer.Изпращач ? "SENDER" : "RECIPIENT";
    } else {
      courierServicePayer =
        payer === DeliveryPayer.Изпращач ? "RECIPIENT" : "SENDER";
    }
  }
  return {
    orderPrice,
    courierServicePayer,
  };
};
