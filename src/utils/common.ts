export const getSelectOptions = (tsEnum) =>
  Object.keys(tsEnum)
    .filter((key) => Number.isNaN(Number(key)))
    .map((entry) => ({ id: tsEnum[entry], label: entry }));
