import { AlertColor } from "@mui/material";
import create from "zustand";
import { Company } from "../pages/Companies/types";
import { Warehouse } from "../types";

export interface Notification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

interface State {
  companies: Company[];
  warehouses: Warehouse[];
  notification: Notification | null;
  setNotification: (notification: Notification) => void;
  setWarehouses: (warehouses: Warehouse[]) => void;
  setCompanies: (companies: Company[]) => void;
}

const useStore = create<State>((set) => ({
  warehouses: [],
  companies: [],
  notification: null,
  setNotification: (notification: Notification) =>
    set(() => ({ notification })),
  setWarehouses: (warehouses) => set(() => ({ warehouses })),
  setCompanies: (companies) => set(() => ({ companies })),
}));

export default useStore;
