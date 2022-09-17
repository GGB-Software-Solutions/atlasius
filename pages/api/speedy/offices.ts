import { BULGARIA_COUNTRY_ID, fetcher } from "../../../src/speedy-api";

export default async function handler(req, res) {
  const body = req.body
    ? JSON.parse(req.body)
    : {
        countryId: BULGARIA_COUNTRY_ID,
      };
  const data = await fetcher("/location/office", body);
  res.status(200).json(data.offices);
}
