import {
	createAsyncThunk,
	createSlice,
} from "@reduxjs/toolkit";

import {
	getMyOrders,
	getOrderById,
} from "@/services/orderService";

import type { Order } from "@/types/order";

interface OrderState {
	orders: Order[];
	selectedOrder: Order | null;
	loading: boolean;
	error: string | null;
}

const initialState: OrderState = {
	orders: [],
	selectedOrder: null,
	loading: false,
	error: null,
};

interface ApiError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

const getOrderErrorMessage = (error: unknown): string => {
	const message = (error as ApiError)?.response?.data?.message;

	return typeof message === "string"
		? message
		: "Something went wrong while loading your orders.";
};

export const fetchMyOrders = createAsyncThunk(
	"orders/fetchMyOrders",
	async (_, { rejectWithValue }) => {
		try {
			const response = await getMyOrders();

			return response.orders;
		} catch (error: unknown) {
			return rejectWithValue(getOrderErrorMessage(error));
		}
	}
);

export const fetchOrderById = createAsyncThunk(
	"orders/fetchOrderById",
	async (orderId: string, { rejectWithValue }) => {
		try {
			const response = await getOrderById(orderId);

			return response.order;
		} catch (error: unknown) {
			return rejectWithValue(getOrderErrorMessage(error));
		}
	}
);

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		clearSelectedOrder: (state) => {
			state.selectedOrder = null;
		},
		clearOrderError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMyOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMyOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(fetchMyOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(fetchOrderById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrderById.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedOrder = action.payload;
			})
			.addCase(fetchOrderById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const {
	clearSelectedOrder,
	clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
