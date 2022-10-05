import { fetcher } from "../../../src/speedy-api";

export default async function handler(req, res) {
  const body = req.query;
  const data = await fetcher("/location/office", body);
  res.setHeader("Cache-Control", "max-age=86400, s-maxage=86400");
  res.status(200).json(data.offices);
}
