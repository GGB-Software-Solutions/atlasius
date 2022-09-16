import { AlertColor } from "@mui/material";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { Company } from "../pages/Companies/types";
import { Warehouse } from "../types";
import { City, Country, Office } from "../types/econt";

export interface Notification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

interface State {
  econtCountries: Country[];
  econtOffices: Office[];
  econtCities: City[];
  companies: Company[];
  warehouses: Warehouse[];
  notification: Notification | null;
  setNotification: (notification: Notification) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setCompanies: (companies: Company[]) => void;
  setEcontCountries: (countries: Country[]) => void;
  setEcontOffices: (offices: Office[]) => void;
  setEcontCities: (cities: City[]) => void;
}

const useStore = create<State>()(
  devtools((set) => ({
    econtCountries: [],
    econtCities: [],
    econtOffices: [],
    warehouses: [],
    companies: [],
    notification: null,
    setNotification: (notification: Notification) =>
      set(() => ({ notification })),
    setWarehouses: (warehouses) => set(() => ({ warehouses })),
    setCompanies: (companies) => set(() => ({ companies })),
    setEcontCountries: (econtCountries) => set(() => ({ econtCountries })),
    setEcontOffices: (econtOffices) => set(() => ({ econtOffices })),
    setEcontCities: (econtCities) => set(() => ({ econtCities })),
  }))
);

export default useStore;
