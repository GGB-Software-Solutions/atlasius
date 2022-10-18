import { fetcher } from "../../src/econt";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const { url, credentials, testMode, ...rest } = body;
  const data = await fetcher({ url, body: rest, credentials, testMode });
  //   res.setHeader("Cache-Control", "max-age=86400, s-maxage=86400");
  res.status(200).json(data);
}
