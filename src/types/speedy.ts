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

export interface SpeedyCity {
  id: number;
  countryId: number;
  mainSiteId: number;
  type: string;
  typeEn: string;
  name: string;
  nameEn: string;
  municipality: string;
  municipalityEn: string;
  region: string;
  regionEn: string;
  postCode: string;
  servingDays: string;
  addressNomenclature: number;
  x: number;
  y: number;
  servingOfficeId: number;
  servingHubOfficeId: number;
}

export interface Parcel {
  id: string;
  seqNo: number;
}

export interface NetAmount {
  amount: number;
  vatPercent: number;
}

export interface AddressPickupSurcharge {
  amount: number;
  percent: number;
  vatPercent: number;
}

export interface Details {
  netAmount: NetAmount;
  addressPickupSurcharge: AddressPickupSurcharge;
  addressDeliverySurcharge: AddressPickupSurcharge;
  fixedDiscount: AddressPickupSurcharge;
  dropOffDiscount: AddressPickupSurcharge;
  pickUpDiscount: AddressPickupSurcharge;
  additionalDiscount: AddressPickupSurcharge;
  fuelSurcharge: AddressPickupSurcharge;
  nonStandardDeliveryDateSurcharge: AddressPickupSurcharge;
  loadUnload: AddressPickupSurcharge;
  islandSurcharge: AddressPickupSurcharge;
  optionsBeforePaymentSurcharge: AddressPickupSurcharge;
  codPremium: AddressPickupSurcharge;
  heavyParcelSurcharge: AddressPickupSurcharge;
  addressNormalizationSurcharge: AddressPickupSurcharge;
  tollSurcharge: AddressPickupSurcharge;
  insurancePremium: AddressPickupSurcharge;
  voucherDiscount: AddressPickupSurcharge;
}

export interface Price {
  amount: number;
  vat: number;
  total: number;
  currency: string;
  details: Details;
  amountLocal: number;
  vatLocal: number;
  totalLocal: number;
  currencyLocal: string;
  detailsLocal: Details;
  currencyExchangeRateUnit: number;
  currencyExchangeRate: number;
}

export interface SpeedyLabel {
  id: string;
  parcels: Parcel[];
  pickupDate: string;
  price: Price;
  deliveryDeadline: Date;
}

export interface SpeedyError {
  context: string;
  message: string;
  id: string;
  code: number;
  component: string;
}
