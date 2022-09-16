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

async function sendSpeedyServiceRequest(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const WithRequiredData = (WrappedComponent) => {
  const withRequiredData = (props) => {
    const setWarehouses = useStore((state) => state.setWarehouses);
    const setCompanies = useStore((state) => state.setCompanies);
    const setEcontCountries = useStore((state) => state.setEcontCountries);
    const econtCountries = useStore((state) => state.econtCountries);
    const setEcontOffices = useStore((state) => state.setEcontOffices);
    const setEcontCities = useStore((state) => state.setEcontCities);
    const setSpeedyOffices = useStore((state) => state.setSpeedyOffices);

    const { data: warehouses, isLoading: isLoadingWarehouses } = useSWR(
      API_ENDPOINTS.Warehouse,
      jsonFetch,
      { revalidateOnFocus: false }
    );
    const { data: companies, isLoading: isLoadingCompanies } = useSWR(
      API_ENDPOINTS.Company,
      jsonFetch,
      { revalidateOnFocus: false }
    );

    const { data: offices, isLoading: isLoadingOffices } = useSWR(
      "getOffices",
      sendEcontServiceRequest,
      { revalidateOnFocus: false }
    );

    const { data: cities, isLoading: isLoadingCities } = useSWR(
      "getCities",
      sendEcontServiceRequest,
      { revalidateOnFocus: false }
    );

    const { data: speedyOffices, isLoading: isLoadingSpeedyOffices } = useSWR(
      "api/speedy/offices",
      sendSpeedyServiceRequest,
      { revalidateOnFocus: false }
    );

    React.useEffect(() => {
      if (speedyOffices) setSpeedyOffices(speedyOffices);
    }, [speedyOffices]);

    React.useEffect(() => {
      if (cities) setEcontCities(cities);
    }, [cities]);

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
      isLoadingCities &&
      isLoadingSpeedyOffices &&
      econtCountries.length ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return withRequiredData;
};

export default WithRequiredData;
