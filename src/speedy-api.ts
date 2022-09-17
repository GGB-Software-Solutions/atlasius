const BASE_URL = "https://api.speedy.bg/v1";

export const BULGARIA_COUNTRY_ID = 100;
const SPEEDY_TEST_USERNAME = "1995507";
const SPEEDY_TEST_PASSWORD = "5813296229";

export const fetcher = async (api: string, body: Record<string, unknown>) => {
  const response = await fetch(`${BASE_URL}${api}`, {
    body: JSON.stringify({
      userName: SPEEDY_TEST_USERNAME,
      password: SPEEDY_TEST_PASSWORD,
      ...body,
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const findSite = async ({ countryId, name }) => {
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

export const getStreets = async ({ siteId, name }) => {
  const response = await fetch("api/speedy/streets", {
    method: "POST",
    body: JSON.stringify({ siteId, name }),
  });
  const data = await response.json();
  return data;
};

export const validateAddress = async (address) => {
  const response = await fetch("api/speedy/address", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
  const data = await response.json();
  return data;
};
