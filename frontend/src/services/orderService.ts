import api from "@/services/api";

import type { Order } from "@/types/order";

interface OrdersResponse {
	orders: Order[];
}

interface OrderResponse {
	order: Order;
}

export const getMyOrders = async (): Promise<OrdersResponse> => {
	const response = await api.get<OrdersResponse>("/orders/customer");

	return response.data;
};

export const getOrderById = async (
	orderId: string
): Promise<OrderResponse> => {
	const response = await api.get<OrderResponse>(`/orders/${orderId}`);

	return response.data;
};
