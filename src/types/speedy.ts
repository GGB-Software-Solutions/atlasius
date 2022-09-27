export interface SpeedyAddress {
  countryId?: number;
  siteId?: number;
  siteType?: string;
  siteName?: string;
  postCode?: string;
  streetId?: number;
  streetType?: string;
  streetName?: string;
  streetNo?: string;
  x?: number;
  y?: number;
  fullAddressString?: string;
  siteAddressString?: string;
  localAddressString?: string;
  addressNote?: string;
}

export interface MaxParcelDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface WorkingTimeSchedule {
  date: string;
  workingTimeFrom: string;
  workingTimeTo: string;
  sameDayDepartureCutoff: string;
  standardSchedule: boolean;
}

export interface SpeedyOffice {
  id: number;
  name: string;
  nameEn: string;
  siteId: number;
  address: SpeedyAddress;
  workingTimeFrom: string;
  workingTimeTo: string;
  workingTimeHalfFrom: string;
  workingTimeHalfTo: string;
  workingTimeDayOffFrom: string;
  workingTimeDayOffTo: string;
  sameDayDepartureCutoff: string;
  sameDayDepartureCutoffHalf: string;
  sameDayDepartureCutoffDayOff: string;
  maxParcelDimensions: MaxParcelDimensions;
  maxParcelWeight: number;
  type: string;
  nearbyOfficeId: number;
  workingTimeSchedule: WorkingTimeSchedule[];
  validFrom: string;
  validTo: string;
  cargoTypesAllowed: string[];
  pickUpAllowed: boolean;
  dropOffAllowed: boolean;
  cardPaymentAllowed: boolean;
  cashPaymentAllowed: boolean;
  palletOffice: boolean;
}

export interface SpeedyCountry {
  id: number;
  name: string;
  nameEn: string;
  isoAlpha2: string;
  isoAlpha3: string;
  postCodeFormats: string;
  requireState: boolean;
  addressType: number;
  currencyCode: string;
  defaultOfficeId: number;
  streetTypes: string;
  streetTypesEn: string;
  complexTypes: string;
  complexTypesEn: string;
  siteNomen: number;
}
