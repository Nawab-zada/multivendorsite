export interface OrderItem {
	product: string;
	vendor: string;
	name: string;
	image?: string;
	price: number;
	quantity: number;
	subtotal: number;
}

export interface ShippingAddress {
	fullName: string;
	phone: string;
	city: string;
	address: string;
}

export interface Order {
	_id: string;
	orderNumber: string;

	customer: string;

	items: OrderItem[];

	shippingAddress: ShippingAddress;

	paymentMethod: string;
	paymentStatus: string;
	orderStatus: string;

	subtotal: number;
	shippingFee: number;
	tax: number;
	totalAmount: number;

	createdAt?: string;
	updatedAt?: string;
}

export interface ApiResponse<T> {
	success?: boolean;
	message?: string;
	data?: T;
}

export interface OrderResponse extends ApiResponse<Order> {
	order: Order;
}

export interface OrdersResponse extends ApiResponse<Order[]> {
	count: number;
	orders: Order[];
}
