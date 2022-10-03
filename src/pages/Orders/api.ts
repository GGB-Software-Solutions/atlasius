import { API_ENDPOINTS } from "../../api";
import { Order } from "../../types";
import { Expedition } from "../../types/expedition";
import { jsonFetch } from "../../utils/fetch";

export type OrderShippingDetails = Partial<
  Pick<
    Order,
    | "id"
    | "address1"
    | "city"
    | "zipCode"
    | "streetName"
    | "streetNumber"
    | "officeId"
    | "country"
  >
>;

export const updateShippingDetails = async (
  shippingDetails: OrderShippingDetails
) => {
  const response = await jsonFetch(
    API_ENDPOINTS.Order + "/update-shipping-details",
    {
      method: "POST",
      body: JSON.stringify(shippingDetails),
    }
  );
  return response;
};

export type UpdateOrderStatus = Partial<
  Pick<
    Order,
    "status" | "fulfillmentStatus" | "warehouseStatus" | "errorStatus"
  >
> & { id: string };

export const updateOrderStatus = async (orderStatuses: UpdateOrderStatus[]) => {
  const response = await jsonFetch(API_ENDPOINTS.Order + "/update-status", {
    method: "POST",
    body: JSON.stringify(orderStatuses),
  });
  return response;
};

export const saveShippingLabel = async (label: Expedition) => {
  const response = await jsonFetch(API_ENDPOINTS.DeliveryDetails, {
    method: "POST",
    body: JSON.stringify({ ...label, createdBy: "6314d8f70e29a132b0262393" }), //TODO: Remove createdBy
  });
  return response;
};
