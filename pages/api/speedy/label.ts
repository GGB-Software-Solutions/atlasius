import { fetcher } from "../../../src/speedy-api";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const data = await fetcher(
    body.type === "print" ? "/print" : "/shipment",
    body,
    body.type === "print" ? true : false
  );
  if (body.type === "print") {
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    res.status(200).end(buffer.toString("base64"));
  } else {
    res.status(200).json(data);
  }
}
