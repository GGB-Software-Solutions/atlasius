import React from "react";
import useSWR from "swr";
import { BULGARIA_COUNTRY_ID, Speedy } from "../../../speedy-api";
import useStore from "../../../store/globalStore";
import { SpeedyCountry } from "../../../types/speedy";

interface Props {
  countryId: SpeedyCountry["id"];
  deliverToOffice: boolean;
  service: Speedy;
}

const useSpeedy = ({ countryId, deliverToOffice, service }: Props) => {
  //Offices for Bulgaria are fetched on startup so we have them in store
  const isCountryBulgaria = countryId === BULGARIA_COUNTRY_ID;
  const bulgarianOffices = useStore((state) => state.speedyOffices);
  const isServiceAvailable = Boolean(service.credentials);

  const { data: offices, isLoading: isLoadingOffices } = useSWR(
    countryId && deliverToOffice && !isCountryBulgaria && isServiceAvailable
      ? countryId.toString()
      : null,
    service.getOffices,
    { revalidateOnFocus: false }
  );

  return {
    offices: isCountryBulgaria ? bulgarianOffices : offices,
    isLoadingOffices,
  };
};

export default useSpeedy;
