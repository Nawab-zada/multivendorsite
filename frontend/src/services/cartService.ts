import api from "@/lib/axios";

export const fetchCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (productId: string, quantity = 1) => {
  const response = await api.post("/cart/add", { productId, quantity });
  return response.data;
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  const response = await api.patch(`/cart/update/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};
