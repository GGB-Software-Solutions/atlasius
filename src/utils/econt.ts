import { City, Office } from "../types/econt";

export const findEcontOffices = (offices: Office[], city: string) => {
  return offices.filter(
    (office) =>
      office.address.city.name.toLowerCase() === city.toLowerCase() ||
      office.address.city.nameEn.toLowerCase() === city.toLowerCase()
  );
};

export const findEcontCity = (econtCities: City[], city: string) => {
  return econtCities.find(
    (econtCity) => econtCity.name === city || econtCity.nameEn === city
  );
};
