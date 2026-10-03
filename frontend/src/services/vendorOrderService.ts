import api from "@/services/api";

export interface VendorOrderCustomer {
  name?: string;
  email?: string;
}

export interface VendorOrder {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  subtotal?: number;
  paymentStatus?: string;
  customerOrder?: {
    orderNumber?: string;
    paymentStatus?: string;
    totalAmount?: number;
  };
  customer?: VendorOrderCustomer;
  items?: Array<{
    quantity: number;
    subtotal: number;
    snapshot?: { name?: string; image?: string; price?: number };
  }>;
  trackingNumber?: string;
  createdAt?: string;
}

interface VendorOrdersResponse {
  success: boolean;
  count: number;
  orders: VendorOrder[];
}

export const getVendorOrders = async (): Promise<VendorOrdersResponse> => {
  const response = await api.get("/vendors/orders");

  return response.data;
};

export const getVendorOrderById = async (id: string): Promise<{ order: VendorOrder }> => {
  const response = await api.get(`/vendors/orders/${id}`);

  return response.data;
};

export const updateVendorOrderStatus = async (
  id: string,
  status: "confirm" | "pack" | "ship" | "deliver"
): Promise<{ order: VendorOrder; message: string }> => {
  const response = await api.patch(`/vendors/orders/${id}/${status}`);

  return response.data;
};
