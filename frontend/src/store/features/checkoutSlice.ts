import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createOrder,
  type CheckoutPayload,
} from "@/services/checkoutService";
import type { Order } from "@/types/order";

interface CheckoutState {
  loading: boolean;
  error: string | null;
  order: Order | null;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  order: null,
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getCheckoutErrorMessage = (error: unknown): string => {
  const message = (error as ApiError)?.response?.data?.message;

  return typeof message === "string"
    ? message
    : "Something went wrong while placing your order.";
};

export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (data: CheckoutPayload, { rejectWithValue }) => {
    try {
      const response = await createOrder(data);

      return response.order;
    } catch (error: unknown) {
      return rejectWithValue(getCheckoutErrorMessage(error));
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckoutError: (state) => {
      state.error = null;
    },

    clearCheckout: (state) => {
      state.order = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCheckoutError, clearCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
