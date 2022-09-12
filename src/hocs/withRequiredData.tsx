import React from "react";
import { jsonFetch } from "../utils/fetch";
import useSWR from "swr";
import { API_ENDPOINTS } from "../api";
import useStore from "../store/globalStore";
import Loader from "../components/Loader";

const WithRequiredData = (WrappedComponent) => {
  const withRequiredData = (props) => {
    const setWarehouses = useStore((state) => state.setWarehouses);
    const setCompanies = useStore((state) => state.setCompanies);
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

    return isLoadingCompanies && isLoadingWarehouses ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return withRequiredData;
};

export default WithRequiredData;
