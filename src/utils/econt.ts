import { Office } from "../types/econt";

export const findOffices = (offices: Office[], city: string) => {
  return offices.filter(
    (office) =>
      office.address.city.name.toLowerCase() === city.toLowerCase() ||
      office.address.city.nameEn.toLowerCase() === city.toLowerCase()
  );
};
