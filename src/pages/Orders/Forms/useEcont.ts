import React from "react";
import useSWR from "swr";
import Econt from "../../../econt";
import useStore from "../../../store/globalStore";
import { City, Country } from "../../../types/econt";

interface Props {
  countryCode: Country["code3"];
  cityID?: City["id"];
  deliverToOffice: boolean;
  service: Econt;
}

const useEcont = ({ countryCode, cityID, deliverToOffice, service }: Props) => {
  //Offices for Bulgaria are fetched on startup so we have them in store
  const isCountryBulgaria = countryCode && countryCode === "BGR";
  const bulgarianOffices = useStore((state) => state.econtOffices);
  const isServiceAvailable = Boolean(service.credentials);

  async function sendRequest(key: string[]) {
    const [url, ...rest] = key;
    return service[url](...rest);
  }

  // Cities
  const { data: cities, isLoading: isLoadingCities } = useSWR(
    countryCode && isServiceAvailable ? ["getCities", countryCode] : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  //Offices
  const { data: offices, isLoading: isLoadingOffices } = useSWR(
    countryCode && deliverToOffice && !isCountryBulgaria && isServiceAvailable
      ? ["getOffices", countryCode]
      : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  //Streets
  const { data: streets, isLoading: isLoadingStreets } = useSWR(
    cityID && !deliverToOffice && isServiceAvailable
      ? ["getStreets", cityID]
      : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  return {
    cities,
    offices: isCountryBulgaria ? bulgarianOffices : offices,
    streets,
    isLoadingCities,
    isLoadingOffices,
    isLoadingStreets,
  };
};

export default useEcont;
