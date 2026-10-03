import api from "@/services/api";

import type { ProductDetails } from "@/store/features/productDetailsSlice";

interface VendorProductsResponse {
  success: boolean;
  count: number;
  products: ProductDetails[];
}

export const getVendorProducts =
  async (): Promise<VendorProductsResponse> => {
    const response = await api.get("/products/vendor");

    return response.data;
  };
