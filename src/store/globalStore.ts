import { AlertColor } from "@mui/material";
import create from "zustand";

export interface Notification {
  autoHideDuration?: number;
  message: string;
  type: AlertColor;
}

const useStore = create((set) => ({
  warehouses: [],
  companies: [],
  notification: null,
  setNotification: (notification: Notification) =>
    set(() => ({ notification })),
  setWarehouses: (warehouses) => set(() => ({ warehouses })),
  setCompanies: (companies) => set(() => ({ companies })),
}));

export default useStore;
