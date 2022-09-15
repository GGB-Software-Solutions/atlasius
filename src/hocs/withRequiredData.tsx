import React from "react";
import { jsonFetch } from "../utils/fetch";
import useSWR from "swr";
import { API_ENDPOINTS } from "../api";
import useStore from "../store/globalStore";
import Loader from "../components/Loader";
import Econt from "../econt";

const econtService = new Econt();

async function sendEcontServiceRequest(url) {
  return econtService[url]();
}

const WithRequiredData = (WrappedComponent) => {
  const withRequiredData = (props) => {
    const setWarehouses = useStore((state) => state.setWarehouses);
    const setCompanies = useStore((state) => state.setCompanies);
    const setEcontCountries = useStore((state) => state.setEcontCountries);
    const econtCountries = useStore((state) => state.econtCountries);
    const setEcontOffices = useStore((state) => state.setEcontOffices);
    const { data: warehouses, isLoading: isLoadingWarehouses } = useSWR(
      API_ENDPOINTS.Warehouse,
      jsonFetch
    );
    const { data: companies, isLoading: isLoadingCompanies } = useSWR(
      API_ENDPOINTS.Company,
      jsonFetch
    );

    const { data: offices, isLoading: isLoadingOffices } = useSWR(
      "getOffices",
      sendEcontServiceRequest,
      { revalidateOnFocus: false }
    );

    React.useEffect(() => {
      if (offices) setEcontOffices(offices);
    }, [offices]);

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
      isLoadingOffices &&
      econtCountries.length ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return withRequiredData;
};

export default WithRequiredData;
