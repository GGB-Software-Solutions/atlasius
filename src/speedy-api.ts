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
