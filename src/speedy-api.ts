import { SpeedyAddress, SpeedyCountry } from "./types/speedy";

const BASE_URL = "https://api.speedy.bg/v1";

export const BULGARIA_COUNTRY_ID = 100;
const SPEEDY_TEST_USERNAME = "1995507";
const SPEEDY_USERNAME = "997839";
const SPEEDY_TEST_PASSWORD = "5813296229";
const SPEEDY_PASSWORD = "7574535198";

export const fetcher = async (
  api: string,
  body: Record<string, unknown>,
  isBlob = false
) => {
  const response = await fetch(`${BASE_URL}${api}`, {
    body: JSON.stringify({
      userName: SPEEDY_USERNAME,
      password: SPEEDY_PASSWORD,
      ...body,
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = isBlob ? await response.blob() : await response.json();
  return data;
};

interface FindSiteProps {
  countryId: SpeedyCountry["id"];
  name: string;
}

export const findSite = async ({ countryId, name }: FindSiteProps) => {
  const response = await fetch("api/speedy/sites", {
    method: "POST",
    body: JSON.stringify({ countryId, name }),
  });
  const data = await response.json();
  return data;
};

export const getOffices = async (countryId: number) => {
  const response = await fetch("api/speedy/sites", {
    method: "POST",
    body: JSON.stringify({ countryId }),
  });
  const data = await response.json();
  return data;
};

interface FindStreetsProps {
  siteId: SpeedyAddress["siteId"];
  name: string;
}

export const getStreets = async ({ siteId, name }: FindStreetsProps) => {
  const response = await fetch("api/speedy/streets", {
    method: "POST",
    body: JSON.stringify({ siteId, name }),
  });
  const data = await response.json();
  return data;
};

export const getComplexes = async ({ siteId, name }: FindStreetsProps) => {
  const response = await fetch("api/speedy/complex", {
    method: "POST",
    body: JSON.stringify({ siteId, name }),
  });
  const data = await response.json();
  return data;
};

export const validateAddress = async (address: SpeedyAddress) => {
  const response = await fetch("api/speedy/address", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
  const data = await response.json();
  return data;
};

export const generateLabel = async (label) => {
  const response = await fetch("api/speedy/label", {
    method: "POST",
    body: JSON.stringify(label),
  });
  const data = await response.json();
  return data;
};

export const printLabel = async (parcelId: string) => {
  const body = {
    type: "print",
    paperSize: "A4",
    parcels: [
      {
        parcel: {
          id: parcelId,
        },
      },
    ],
  };
  const response = await fetch("api/speedy/label", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await response.text();
  return data;
};
