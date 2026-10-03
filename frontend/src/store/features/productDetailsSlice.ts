import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getProductById } from "@/services/productService";

export interface ProductDetails {
  _id: string;
  name: string;
  description: string;
  brand?: string;
  price: number;
  images: string[];
  stock: number;
  category?: string | {
    _id: string;
    name: string;
    slug: string;
  };
}

interface ProductDetailsState {
  product: ProductDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductDetailsState = {
  product: null,
  loading: false,
  error: null,
};

export const fetchProductById = createAsyncThunk(
  "product/details",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to load product.";

      return rejectWithValue(message);
    }
  }
);

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.product = null;
      });
  },
});

export const { clearProductDetails } = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
