import React from "react";
import useSWR from "swr";
import { BULGARIA_COUNTRY_ID, getOffices } from "../../../speedy-api";
import useStore from "../../../store/globalStore";
import { SpeedyCountry } from "../../../types/speedy";

interface Props {
  countryId: SpeedyCountry["id"];
  deliverToOffice: boolean;
}

const useSpeedy = ({ countryId, deliverToOffice }: Props) => {
  //Offices for Bulgaria are fetched on startup so we have them in store
  const isCountryBulgaria = countryId === BULGARIA_COUNTRY_ID;
  const bulgarianOffices = useStore((state) => state.speedyOffices);

  const { data: offices, isLoading: isLoadingOffices } = useSWR(
    countryId && deliverToOffice && !isCountryBulgaria
      ? countryId.toString()
      : null,
    getOffices,
    { revalidateOnFocus: false }
  );

  return {
    offices: isCountryBulgaria ? bulgarianOffices : offices,
    isLoadingOffices,
  };
};

export default useSpeedy;
