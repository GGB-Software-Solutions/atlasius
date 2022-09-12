import create from "zustand";

const useStore = create((set) => ({
  warehouses: [],
  companies: [],
  isLoggedIn: false,
  user: null,
  setUser: (user) => set(() => ({ user, isLoggedIn: true })),
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  setWarehouses: (warehouses) => set(() => ({ warehouses })),
  setCompanies: (companies) => set(() => ({ companies })),
}));

export default useStore;
