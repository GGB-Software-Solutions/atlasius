import React from "react";
import { jsonFetch } from "../utils/fetch";
import useSWR from "swr";
import { API_ENDPOINTS } from "../api";
import useStore from "../store/globalStore";
import Loader from "../components/Loader";
import Econt from "../econt";

const WithRequiredData = (WrappedComponent) => {
  const withRequiredData = (props) => {
    const econtService = new Econt();
    const setWarehouses = useStore((state) => state.setWarehouses);
    const setCompanies = useStore((state) => state.setCompanies);
    const setEcontCountries = useStore((state) => state.setEcontCountries);
    const econtCountries = useStore((state) => state.econtCountries);
    const { data: warehouses, isLoading: isLoadingWarehouses } = useSWR(
      API_ENDPOINTS.Warehouse,
      jsonFetch
    );
    const { data: companies, isLoading: isLoadingCompanies } = useSWR(
      API_ENDPOINTS.Company,
      jsonFetch
    );
    React.useEffect(() => {
      if (warehouses) setWarehouses(warehouses);
    }, [warehouses]);

    React.useEffect(() => {
      setCompanies(companies);
    }, [companies]);

    React.useEffect(() => {
      const getCountries = async () => {
        const countries = await econtService.getCountries();
        setEcontCountries(countries);
      };
      getCountries();
    }, []);

    return isLoadingCompanies &&
      isLoadingWarehouses &&
      econtCountries.length ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return withRequiredData;
};

export default WithRequiredData;
