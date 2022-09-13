import { AlertColor } from "@mui/material";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { Company } from "../pages/Companies/types";
import { Warehouse } from "../types";
import { Country } from "../types/econt";

export interface Notification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

interface State {
  econtCountries: Country[];
  companies: Company[];
  warehouses: Warehouse[];
  notification: Notification | null;
  setNotification: (notification: Notification) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setCompanies: (companies: Company[]) => void;
  setEcontCountries: (countries: Country[]) => void;
}

const useStore = create<State>()(
  devtools((set) => ({
    econtCountries: [],
    warehouses: [],
    companies: [],
    notification: null,
    setNotification: (notification: Notification) =>
      set(() => ({ notification })),
    setWarehouses: (warehouses) => set(() => ({ warehouses })),
    setCompanies: (companies) => set(() => ({ companies })),
    setEcontCountries: (econtCountries) => set(() => ({ econtCountries })),
  }))
);

export default useStore;
