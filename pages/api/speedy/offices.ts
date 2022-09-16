import { BULGARIA_COUNTRY_ID, fetcher } from "../../../src/speedy-api";

export default async function handler(req, res) {
  const data = await fetcher("/location/office", {
    countryId: BULGARIA_COUNTRY_ID,
  });
  res.status(200).json(data.offices);
}
