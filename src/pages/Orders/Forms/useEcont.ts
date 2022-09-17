import React from "react";
import useSWR from "swr";
import Econt from "../../../econt";
import useStore from "../../../store/globalStore";
import { City, Country } from "../../../types/econt";

const econtService = new Econt();

async function sendRequest(key) {
  const [url, ...rest] = key;
  return econtService[url](...rest);
}

interface Props {
  countryCode: Country["code3"];
  cityID: City["id"];
  deliverToOffice: boolean;
}

const useEcont = ({ countryCode, cityID, deliverToOffice }: Props) => {
  //Offices for Bulgaria are fetched on startup so we have them in store
  const isCountryBulgaria = countryCode && countryCode === "BGR";
  const bulgarianOffices = useStore((state) => state.econtOffices);
  // Cities
  const { data: cities, isLoading: isLoadingCities } = useSWR(
    countryCode ? ["getCities", countryCode] : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  //Offices
  const { data: offices, isLoading: isLoadingOffices } = useSWR(
    countryCode && deliverToOffice && !isCountryBulgaria
      ? ["getOffices", countryCode]
      : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  //Streets
  const { data: streets, isLoading: isLoadingStreets } = useSWR(
    cityID && !deliverToOffice ? ["getStreets", cityID] : null,
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
