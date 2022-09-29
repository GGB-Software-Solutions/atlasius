export interface Expedition {
  shipmentId: string;
  companyId: string;
  orderId: string;
  deliveryCompany: string;
  deliveryPrice: number;
  status: string;
  pdfUrl?: string; //For econt only
}
