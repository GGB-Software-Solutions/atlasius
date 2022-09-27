import { API_ENDPOINTS } from "../../api";
import { Order } from "../../types";
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
    { method: "POST", body: JSON.stringify(shippingDetails) }
  );
  return response;
};

// errorStatus?
export type UpdateOrderStatus = Partial<
  Pick<Order, "status" | "fulfillmentStatus" | "warehouseStatus">
> & { id: string };

export const updateOrderStatus = async (orderStatus: UpdateOrderStatus) => {
  const response = await jsonFetch(API_ENDPOINTS.Order + "/update-status", {
    method: "POST",
    body: JSON.stringify(orderStatus),
  });
  return response;
};
