import { read, utils } from "xlsx";

export const getData = <T>(file: ArrayBuffer) => {
  const wb = read(file);
  const data = utils.sheet_to_json<T>(wb.Sheets[wb.SheetNames[0]]);
  return data;
};
