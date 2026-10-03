import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addToCart as addToCartApi,
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/cartService";

interface CartApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getCartErrorMessage = (error: unknown): string => {
  const message = (error as CartApiError)?.response?.data?.message;

  return typeof message === "string"
    ? message
    : "Something went wrong while updating the cart.";
};

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToCartApi(productId, quantity);
      return response.cart;
    } catch (error: unknown) {
      return rejectWithValue(getCartErrorMessage(error));
    }
  }
);

export const loadCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCart();
      return response.cart;
    } catch (error: unknown) {
      return rejectWithValue(getCartErrorMessage(error));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateCartQuantity(productId, quantity);
      return response.cart;
    } catch (error: unknown) {
      return rejectWithValue(getCartErrorMessage(error));
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/remove",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await removeFromCart(productId);
      return response.cart;
    } catch (error: unknown) {
      return rejectWithValue(getCartErrorMessage(error));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.items?.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) || 0;
        state.totalPrice = action.payload.items?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.quantity * (item.product?.price || 0),
          0
        ) || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.items?.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) || 0;
        state.totalPrice = action.payload.items?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.quantity * (item.product?.price || 0),
          0
        ) || 0;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalItems = action.payload.items?.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) || 0;
        state.totalPrice = action.payload.items?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.quantity * (item.product?.price || 0),
          0
        ) || 0;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalItems = action.payload.items?.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) || 0;
        state.totalPrice = action.payload.items?.reduce(
          (sum: number, item: CartItem) =>
            sum + item.quantity * (item.product?.price || 0),
          0
        ) || 0;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
