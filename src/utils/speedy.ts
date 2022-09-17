import { SpeedyOffice } from "../types/speedy";

export const findSpeedyOffices = (offices: SpeedyOffice[], city: string) => {
  return offices.filter(
    (office) =>
      office.address.city.name.toLowerCase() === city.toLowerCase() ||
      office.address.city.nameEn.toLowerCase() === city.toLowerCase()
  );
};
