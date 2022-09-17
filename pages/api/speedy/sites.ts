import { fetcher } from "../../../src/speedy-api";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const data = await fetcher("/location/site", body);
  res.status(200).json(data.sites);
}
