import api from "@/services/api";
import type { Order, ShippingAddress } from "@/types/order";

export interface CheckoutPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: "cod";
}

export interface CheckoutResponse {
  order: Order;
  message?: string;
}

export const createOrder = async (
  data: CheckoutPayload
): Promise<CheckoutResponse> => {
  const response = await api.post("/orders/checkout", data);

  return response.data;
};
