import create from "zustand";

const useStore = create((set) => ({
  warehouses: [],
  companies: [],
  setWarehouses: (warehouses) => set(() => ({ warehouses })),
  setCompanies: (companies) => set(() => ({ companies })),
}));

export default useStore;
