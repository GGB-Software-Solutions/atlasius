import { AlertColor } from "@mui/material";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { Company } from "../pages/Companies/types";
import { Warehouse } from "../types";
import { City, Country, Office } from "../types/econt";
import { SpeedyOffice } from "../types/speedy";

export interface Notification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

interface State {
  speedyOffices: SpeedyOffice[];
  econtCountries: Country[];
  econtOffices: Office[];
  econtCities: City[];
  companies: Company[];
  selectedCompany: Company;
  warehouses: Warehouse[];
  notification: Notification | null;
  setNotification: (notification: Notification) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setCompanies: (companies: Company[]) => void;
  setEcontCountries: (countries: Country[]) => void;
  setEcontOffices: (offices: Office[]) => void;
  setEcontCities: (cities: City[]) => void;
  setSpeedyOffices: (offices: SpeedyOffice[]) => void;
  setSelectedCompany: (company: Company) => void;
}

const useStore = create<State>()(
  devtools((set) => ({
    speedyOffices: [],
    econtCountries: [],
    econtCities: [],
    econtOffices: [],
    warehouses: [],
    companies: [],
    selectedCompany: null,
    notification: null,
    setNotification: (notification: Notification) =>
      set(() => ({ notification })),
    setWarehouses: (warehouses) => set(() => ({ warehouses })),
    setCompanies: (companies) => set(() => ({ companies })),
    setEcontCountries: (econtCountries) => set(() => ({ econtCountries })),
    setEcontOffices: (econtOffices) => set(() => ({ econtOffices })),
    setEcontCities: (econtCities) => set(() => ({ econtCities })),
    setSpeedyOffices: (speedyOffices) => set(() => ({ speedyOffices })),
    setSelectedCompany: (company) => set(() => ({ selectedCompany: company })),
  }))
);

export default useStore;
