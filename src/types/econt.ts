/*
 * Office of Econt Express. Required fields for identifying an office - code or ID
 */
export type Office = {
  id: number;
  // A code identifying the office
  code: string;
  // True if the office is a mobile post station
  isMPS: boolean;
  // True if the office is an automatic post station
  isAPS: boolean;
  // The bulgarian name of the office
  name: string;
  // The numberernational name of the office
  nameEn: string;
  // A list of phone numbers for the office
  phones: string[];
  // A list of email addresses for the office
  emails: string[];
  // The address where the office is located
  address: Address;
  // Additional information
  info: string;
  // The currency the office works with
  currency: string;
  // The language the office works with
  language: string;
  // Business hours for parcel pickup and delivery from/to an address on weekdays
  normalBusinessHoursFrom: number;
  // Business hours for parcel pickup and delivery from/to an address on weekdays
  normalBusinessHoursTo: number;
  // Business hours for parcel pickup and delivery from/to an address on saturdays
  halfDayBusinessHoursFrom: number;
  // Business hours for parcel pickup and delivery from/to an address on saturdays
  halfDayBusinessHoursTo: number;
  // Types of shipments which can be sent/collected to/from the office
  shipmentTypes: ShipmentType[];
  // Partner code
  partnerCode: string;
  // Code of the distribution center associated with the office
  hubCode: string;
  // Name of the distribution center associated with the office
  hubName: string;
  // numberernational name of the distribution center associated with the office
  hubNameEn: string;
};

/*
 * Address. Required fields for valid address - city, street and street number (or quarter and other).
 * Use respective fields or all joined together in the field `fullAddress`
 */
export type Address = {
  id?: number;
  // The city where the address is located
  city: City;
  // The whole address
  fullAddress?: string;
  // Quarter name
  quarter?: string;
  // Street name
  street: string;
  // Street number
  num: string;
  // Block number, entrance number, floor, apartment number and other additional information
  other?: string;
  // Geo coordinates
  location?: GeoLocation;
  // ZIP code
  zip?: string;
};

/*
 * City served by Econt Express. Required fields for valid city - ID or name + post code
 * (if the City is outside Bulgaria, country is required)
 */
export type City = {
  id?: number;
  // The country where the city is located
  country: Country;
  // Post code
  postCode?: string;
  // Bulgarian name
  name?: string;
  // numberernational name
  nameEn?: string;
  // Bulgarian name of the region
  regionName?: string;
  // numberernational name of the region
  regionNameEn?: string;
  // The phone prefix code for the city
  phoneCode?: string;
  // Geolocation
  location?: GeoLocation;
  // Indicates if express city deliveries are available
  expressCityDeliveries?: boolean;
};

/*
 * Required fields for valid country - ID or code (code2 or code3)
 */
export type Country = {
  id?: number;
  // ISO 3166-1 alpha-2 code (e.g. BG, GB, GR)
  code2?: string;
  // ISO 3166-1 alpha-3 code (e.g. BGR ,GBR, GRC)
  code3?: string;
  // The bulgarian name of the country
  name?: string;
  // The international name of the country
  nameEn?: string;
  // True if country is a member of the EU
  isEU?: boolean;
};

/*
 * A geographic location
 */
type GeoLocation = {
  // Geographic coordinate that specifies the north–south position of a ponumber on the Earth's surface
  latitude: number;
  // Geographic coordinate that specifies the east-west position of a ponumber on the Earth's surface
  longitude: number;
  // The expected accuracy of the location: 0-none, there are either no coordinates or the coordinates
  // do not represent the location; 1-low; 2-medium; 3-high;
  confidence: number;
};

export enum ShipmentType {
  // Documents (up to 0.5kg)
  document = "document",
  // Parcel (up to 50kg)

  pack = "Pack",
  // Post parcel (up to 20kg, 60x60x60cm and sub-code = office-office)
  post_pack = "post_pack",
  // Pallet (80x120x180cm and up to 1000kg)
  pallet = "pallet",
  // Cargo express (palletized shipment over 80x120x180cm up to 200x200x180 and up to 500kg)
  cargo = "cargo",
  // Pallet + documents
  documentpallet = "documentpallet",
  // Letter (big)
  big_letter = "big_letter",
  // Letter (small)
  small_letter = "small_letter",
  // Money transfer
  money_transfer = "money_transfer",
  // Post transfer
  pp = "pp",
}

type ClientProfile = {
  id?: number;
  // Name
  name: string;
  // International name
  nameEn?: string;
  // Phone numbers (only digits and optional "+" in the beginning)
  phones: string[];
  // E-mail addresses
  email?: string;
  // Skype accounts
  skypeAccounts?: string[];
  // Client number
  clientNumber?: string;
  // Client number (en)
  clientNumberEn?: string;
  // The client is a company
  juridicalEntity?: boolean;
  // Personal identification type (EGN, PIN, PK, PASSPORT)
  personalIDType?: string;
  // Personal ID number (EGN)
  personalIDNumber?: string;
  // Company type (registration of the company)
  companyType?: string;
  // Registration number
  ein?: string;
  // VAT registration prefix (two-letter code)
  ddsEinPrefix?: string;
  // VAT registration
  ddsEin?: string;
  // Company's registration address
  registrationAddress?: string;
  // Name of the company's representative
  molName?: string;
  // Unique citizenship number (EGN) of the company's representative
  molEGN?: string;
  // ID cart of the company's representative
  molIDNum?: string;
};

type PackElement = {
  // Pack width
  width: number;
  // Pack height
  height: number;
  // Pack length
  length: number;
  // Pack weight
  weight: number;
};

enum Weekday {
  monday = "Monday",
  tuesday = "Tuesday",
  wednesday = "Wednesday",
  thursday = "Thursday",
  friday = "Friday",
  saturday = "Saturday",
  sunday = "Sunday",
}

type CDPayOptions = {
  // Shipment number
  num: string;
  // Client
  client: ClientProfile;
  // Payment with money transfer
  moneyTransfer: boolean;
  // Express
  express: boolean;
  // "Office", "door" or "bank"
  method: string;
  // Address
  address: Address;
  // Office code
  officeCode: string;
  // International Bank Account Number
  IBAN: string;
  // Bank Identifier Code
  BIC: string;
  // Currency of the bank account
  bankCurrency: string;
  // Only for method=bank, either payDays or payWeekdays
  payDays: number[];
  // Only for method=bank, either payDays or payWeekdays
  payWeekdays: Weekday[];
  // Additional instructions
  additionalInstructions: string;
};

type ShippingLabelServices = {
  // Earliest time for delivery (format: HH:MM)
  priorityTimeFrom: string;
  // Latest time for delivery (format: HH:MM)
  priorityTimeTo: string;
  // Indicates if delivery receipt should be returned to sender (additional service - DC)
  deliveryReceipt: boolean;
  // Indicates if delivery receipt should be returned to sender with digital receipt (additional service - EDC)
  digitalReceipt: boolean;
  // Indicates if confirmation for receiving goods should be delivered to sender (additional service - DC-CP)
  goodsReceipt: boolean;
  // Indicates if it is a two-way shipment (additional service - DP)
  twoWayShipment: boolean;
  // Indicates if there is delivery to floor (additional service)
  deliveryToFloor: boolean;
  pack5: number;
  pack6: number;
  pack8: number;
  pack9: number;
  pack10: number;
  pack12: number;
  // Indicates if the shipment should be transported with a cooler bag (additional service - REF)
  refrigeratedPack: number;
  // The declared value of the shipment
  declaredValueAmount: number;
  // The currency of the declared value of the shipment
  declaredValueCurrency: string;
  // Money transfer amount
  moneyTransferAmount: number;
  // Express money transfer
  expressMoneyTransfer: boolean;
  // "Cash on delivery" amount
  cdAmount: number;
  // "Cash on delivery" accepted types: get or give
  cdType: string;
  // "Cash on delivery" currency
  cdCurrency: string;
  // "Cash on delivery" payment options template
  cdPayOptionsTemplate: string;
  // "Cash on delivery" payment options
  cdPayOptions: CDPayOptions;
  // Providing invoice before payment of "Cash on delivery"
  invoiceBeforePayCD: boolean;
  // SMS notifications for the receiver
  smsNotification: boolean;
  // Invoice number (up to 11 digits) and date (31.12.21) for department sale
  invoiceNum: string;
};

enum InstructionType {
  // Instruction type for collecting a shipment from the sender
  take,
  // Instruction type for giving over a shipment to the receiver
  give,
  // Instruction type for returning a shipment
  return,
  // Instruction type for additional services
  services,
}

type HostedFile = {
  id: number;
  // The name of the hosted file
  filename: string;
  // File type (text, xml, application, x-msexcel)
  mimeType: string;
  // The URL address of the hosted file
  URL: string;
  // The content of the hosted file
  content: string;
};

type ReturnInstructionParams = {
  // Destination of the return parcel (empty -> no return parcel, sender -> return to sender, office -> return to office, address -> return to address)
  returnParcelDestination: string;
  // Indicates if the return parcel is document (true -> the return shipment is a document, false -> the return shipment is the same type as the original)
  returnParcelIsDocument: boolean;
  // The maximum period (in days) for sending the return shipment
  daysUntilReturn: number;
  // Payer of the return shipment (sender, receiver)
  returnParcelPaymentSide: string;
  // Receiver for the return shipment (if empty -> original sender)
  returnParcelReceiverClient: ClientProfile;
  // Receiver's authorized person for the return shipment (if empty -> original sender's authorized person)
  returnParcelReceiverAgent: ClientProfile;
  // Receiver's office code for the return shipment (if empty -> original sender's office code)
  returnParcelReceiverOfficeCode: string;
  // Receiver's address for the return shipment (if empty -> original sender's address)
  returnParcelReceiverAddress: Address;
  // If label for return shipment should be generated upon creation of the first shipment
  printReturnParcel: boolean;
  // The actions available if the shipment is rejected: contact - contact sender (rejectContact) instruction - text with instructions (rejectInstruction) return_to_sender - return to sender return_to_office - return to other - to office (rejectReturnClient, RejectReturnAgent, RejectReturnOfficeCode) return_to_address - return to other - to address (rejectReturnClient, RejectReturnAgent, RejectReturnAddress) The fields: rejectInstruction, rejectContact, rejectReturnReceiver or rejectReturnToSender cannot be used at once
  rejectAction: string;
  // Text instruction if the shipment is rejected by the receiver
  rejectInstruction: string;
  // Phone or e-mail contact if the shipment is rejected by the receiver
  rejectContact: string;
  // Client, to whom the original (first) shipment should be returned
  rejectReturnClient: ClientProfile;
  // Authorized person, to whom the original (first) shipment should be returned
  rejectReturnAgent: ClientProfile;
  // The code of the office, where the original (first) shipment should be returned
  rejectReturnOfficeCode: string;
  // Address, where the original (first) shipment should be returned to
  rejectReturnAddress: Address;
  // Payer of the original (first) shipment if it is rejected by the receiver after review (sender, receiver)
  rejectOriginalParcelPaySide: string;
  // Payer of the return shipment if the original (first) is rejected by the receiver after review (sender, receiver)
  rejectReturnParcelPaySide: string;
  // Marks if the returning documents should be signed by the client (returnParcelIsDocument should be 'true')
  signatureDocuments: boolean;
  // The color of the pen, which have to be used for signing the documents
  signaturePenColor: string;
  // Number of total signatures that have to be done
  signatureCount: number;
  // Page numbers of the document where the client should put his signature
  signaturePageNumbers: string;
  // Other or additional instructions in free text
  signatureOtherInstructions: string;
};

/*
 * Additional instructions for receiving, giving over or returning of shipment
 */
type Instruction = {
  id: number;
  // The type of the instruction
  type: InstructionType;
  // The title of the instruction for receiving or giving over a shipment
  title: string;
  // Content of the instruction for receiving or giving over a shipment
  description: string;
  // Attached files with instructions for receiving or giving over a shipment
  attachments: HostedFile[];
  // Recorded voice message with instruction for receiving or giving over a shipment (mp3)
  voiceDescription: HostedFile;
  // Instruction parameters for returning a shipment
  returnInstructionParams: ReturnInstructionParams;
  // Instruction template name
  name: string;
  // Whether or not the template should be applied for all sender's shipments
  applyToAllParcels: boolean;
  // Whether or not the template should be applied for all sender's shipments to given receivers
  applyToReceivers: string[];
};

type PackingListElement = {
  // Inventory number
  inventoryNum: string;
  // Description
  description: string;
  // Weight
  weight: number;
  // count
  count: number;
  // Price
  price: number;
  // File
  file: HostedFile;
};

type ShippingLabel = {
  // Shipment number
  shipmentNumber?: string;
  // The number of the parent (previous) shipment
  previousShipmentNumber?: string;
  // The phone number of the receiver of the parent (previous) shipment
  previousShipmentReceiverPhone?: string;
  // Sender
  senderClient?: ClientProfile;
  // Authorized sender
  senderAgent?: ClientProfile;
  // Address of the sender
  senderAddress?: Address;
  // Office code of the sender
  senderOfficeCode?: string;
  // E-mail for delivery notification
  emailOnDelivery?: string;
  // Indicates whether an SMS should be sent after the delivery
  smsOnDelivery?: string;
  // Receiver
  receiverClient?: ClientProfile;
  // Authorized receiver
  receiverAgent?: ClientProfile;
  // Address of the receiver
  receiverAddress?: Address;
  // Office code of the receiver
  receiverOfficeCode?: string;
  // Provider ID of the receiver
  receiverProviderID?: number;
  // BIC of the receiver
  receiverBIC?: string;
  // IBAN of the receiver
  receiverIBAN?: string;
  // Envelope numbers
  envelopeNumbers?: string[];
  // Pack count
  packCount: number;
  // Packs
  packs?: PackElement[];
  // Shipment type
  shipmentType: ShipmentType;
  // Weight
  weight: number;
  // Indicates if all shipment dimensions are under 60cm (by default: 'false')
  sizeUnder60cm?: boolean;
  // Shipment dimensions (length)
  shipmentDimensionsL?: number;
  // Shipment dimensions (width)
  shipmentDimensionsW?: number;
  // Shipment dimensions (height)
  shipmentDimensionsH?: number;
  // Shipment description
  shipmentDescription: string;
  // Order number
  orderNumber?: string;
  // The date when the shipment is sent
  sendDate?: string;
  // 'Halfday', 'workday', or specific date (yyyy-mm-dd)
  holidayDeliveryDay?: string;
  // Indicates if the shipment should be kept upright (ON/OFF)
  keepUpright?: boolean;
  // Services
  services?: ShippingLabelServices;
  // Instructions
  instructions?: Instruction[];
  // Indicates whether the shipment can be checked before payment
  payAfterAccept?: boolean;
  // Indicates whether the shipment can be tested before payment
  payAfterTest?: boolean;
  // Packing list type - file, digital, loading
  packingListType?: string;
  // Packing list
  packingList?: PackingListElement[];
  // Indicates whether partial delivery is allowed
  partialDelivery?: boolean;
  // Payment method of the sender - <empty>, cash or credit
  paymentSenderMethod?: string;
  // Payment method of the receiver - <empty>, cash or credit
  paymentReceiverMethod?: string;
  // Amount of the payment for the receiver
  paymentReceiverAmount?: number;
  // Indicates if the payment due from the receiver is a percentage
  paymentReceiverAmountIsPercent?: boolean;
  // The number of the client who is paying as a third party
  paymentOtherClientNumber?: string;
  // Amount to be paid from third party
  paymentOtherAmount?: number;
  // Indicates if the payment due from third party is a percentage
  paymentOtherAmountIsPercent?: boolean;
  // Mediator for the shipment
  mediator?: string;
  // Payment token for blocking payments
  paymentToken?: string;
};

type ShipmentStatusService = {
  // Type
  type: string;
  // Description
  description: string;
  // Shipment status count
  count: number;
  // Indicates the payment side (sender, receiver, other)
  paymentSide: string;
  // Price
  price: number;
  // Currency
  currency: string;
};

type ShipmentTrackingEvent = {
  // Indicates if the event is of a return receipt (DC)
  isReceipt: boolean;
  // Destination type
  destinationType: string;
  // Destination details
  destinationDetails: string;
  // Destination details (en)
  destinationDetailsEn: string;
  // Office name
  officeName: string;
  // Office name (en)
  officeNameEn: string;
  // City name
  cityName: string;
  // International city name
  cityNameEn: string;
  // Three-letter ISO Alpha-3 code of the country (e.g. AUT, BGR, etc.)
  countryCode: string;
  // destination office code
  officeCode: string;
  // Time
  time: string;
};

type NextShipmentElement = {
  // Shipment number
  shipmentNumber: string;
  // Reason
  reason: string;
  // URL with the PDF result
  pdfURL: string;
};

type ShipmentStatus = {
  // Shipment number
  shipmentNumber: string;
  // Storage office name
  storageOfficeName: string;
  // Storage person name
  storagePersonName: string;
  // Created time
  createdTime: string;
  // The time when the shipment is sent
  sendTime: string;
  // Delivery time
  deliveryTime: string;
  // Shipment type
  shipmentType: ShipmentType;
  // Count of packs
  packCount: number;
  // Shipment description
  shipmentDescription: string;
  // Weight
  weight: number;
  // Sender delivery type - door or office
  senderDeliveryType: string;
  // Sender
  senderClient: ClientProfile;
  // Authorized sender
  senderAgent: ClientProfile;
  // The office code of the sender
  senderOfficeCode: string;
  // Address of the sender
  senderAddress: Address;
  // Receiver delivery type - door or office
  receiverDeliveryType: string;
  // Receiver
  receiverClient: ClientProfile;
  // Authorized receiver
  receiverAgent: ClientProfile;
  // The office code of the receiver
  receiverOfficeCode: string;
  // The address of the receiver
  receiverAddress: Address;
  // Collected "cash on delivery" amount
  cdCollectedAmount: number;
  // Collected "cash on delivery" currency
  cdCollectedCurrency: string;
  // Collected "cash on delivery" time
  cdCollectedTime: string;
  // "Cash on delivery" paid amount
  cdPaidAmount: number;
  // "Cash on delivery" paid currency
  cdPaidCurrency: string;
  // Paid "cash on delivery" time
  cdPaidTime: string;
  // The total price of the shipment
  totalPrice: number;
  // Currency
  currency: string;
  // Discount percentage
  discountPercent: number;
  // Amount of discount
  discountAmount: number;
  // Description of the discount
  discountDescription: string;
  // Due amount from the sender
  senderDueAmount: number;
  // Due amount from the receiver
  receiverDueAmount: number;
  // Other due amounts
  otherDueAmount: number;
  // Count of delivery attempts
  deliveryAttemptCount: number;
  // The previous shipment number (if any)
  previousShipmentNumber: string;
  // Services
  services: ShipmentStatusService[];
  // Subsequent shipments (if there are instructions for returning shipments/documents)
  nextShipments: NextShipmentElement[];
  // Shipment tracking events
  trackingEvents: ShipmentTrackingEvent[];
  // URL with the PDF result
  pdfURL: string;
  // Expected delivery date
  expectedDeliveryDate: string;
  // Return shipment form URL
  returnShipmentURL: string;
};

export type OfficeInput = {
  // Three-letter ISO Alpha-3 code of the country (e.g. AUT, BGR, etc.)
  countryCode?: string;
  //ID of the city (optional)
  cityID?: number;
};

export type OfficesPayload = {
  offices: Office[];
};

/*
 * Request for creating a label
 */
export type CreateLabelInput = {
  // Shipment label
  label: ShippingLabel;
  // Indicates the beginning of the time period in which the shipment can be collected from you
  requestCourierTimeFrom?: number;
  // Indicates the end of the time period in which the shipment can be collected
  requestCourierTimeTo?: number;
  // Supported modes - calculate, validate, create, calculate_with_block
  mode: string;
};

export type CreateLabelPayload = {
  // Information about the shipment/label
  label: ShipmentStatus;
  // URL for making a blocking payment for the parcel
  blockingPaymentURL: string;
};
