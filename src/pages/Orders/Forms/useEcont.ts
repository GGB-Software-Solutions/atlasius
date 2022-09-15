import React from "react";
import useSWR from "swr";
import Econt from "../../../econt";
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
  // Cities
  const { data: cities, isLoading: isLoadingCities } = useSWR(
    countryCode ? ["getCities", countryCode] : null,
    sendRequest,
    { revalidateOnFocus: false }
  );

  //Offices
  const { data: offices, isLoading: isLoadingOffices } = useSWR(
    countryCode && cityID && deliverToOffice
      ? ["getOffices", countryCode, cityID]
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
    offices,
    streets,
    isLoadingCities,
    isLoadingOffices,
    isLoadingStreets,
  };
};

export default useEcont;
